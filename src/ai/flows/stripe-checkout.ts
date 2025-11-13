'use server';

/**
 * @fileOverview This file contains the Genkit flows for creating a Stripe Checkout session and Customer Portal.
 * 
 * - createCheckoutSession - Creates a Stripe Checkout session for a given price ID.
 * - createCustomerPortalSession - Creates a session for the Stripe Customer Portal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const CheckoutSessionInputSchema = z.object({
  priceId: z.string().describe('The ID of the Stripe Price object.'),
  userId: z.string().describe('The internal user ID to associate with the Stripe customer.'),
});
export type CheckoutSessionInput = z.infer<typeof CheckoutSessionInputSchema>;

const CheckoutSessionOutputSchema = z.object({
  url: z.string().describe('The URL to redirect the user to for checkout.'),
});
export type CheckoutSessionOutput = z.infer<typeof CheckoutSessionOutputSchema>;


const CustomerPortalInputSchema = z.object({
    userId: z.string().describe('The internal user ID associated with the Stripe customer.'),
});
export type CustomerPortalInput = z.infer<typeof CustomerPortalInputSchema>;

const CustomerPortalOutputSchema = z.object({
    url: z.string().describe('The URL to the Stripe Customer Portal.'),
});
export type CustomerPortalOutput = z.infer<typeof CustomerPortalOutputSchema>;


export async function createCheckoutSession(
  input: CheckoutSessionInput
): Promise<CheckoutSessionOutput> {
  return createCheckoutSessionFlow(input);
}

const createCheckoutSessionFlow = ai.defineFlow(
  {
    name: 'createCheckoutSessionFlow',
    inputSchema: CheckoutSessionInputSchema,
    outputSchema: CheckoutSessionOutputSchema,
  },
  async ({ priceId, userId }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
        throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
    }

    // In a real app, you would look up if the user already has a Stripe Customer ID
    // and re-use it. For this example, we'll create a new customer each time.
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
      },
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer: customer.id,
        success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
      });

      if (!session.url) {
        throw new Error('Could not create Stripe session URL.');
      }

      return {
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Failed to create Stripe checkout session.');
    }
  }
);


export async function createCustomerPortalSession(input: CustomerPortalInput): Promise<CustomerPortalOutput> {
    return createCustomerPortalSessionFlow(input);
}

const createCustomerPortalSessionFlow = ai.defineFlow(
    {
        name: 'createCustomerPortalSessionFlow',
        inputSchema: CustomerPortalInputSchema,
        outputSchema: CustomerPortalOutputSchema,
    },
    async ({ userId }) => {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!appUrl) {
            throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
        }

        let customerId;

        // In a real application, you would retrieve the Stripe Customer ID
        // from your database (e.g., Firestore) based on the userId.
        // For this prototype, we'll search for the customer by metadata.
        const customers = await stripe.customers.list({
            limit: 1,
            email: 'test-customer@example.com' // A placeholder to find a test customer
        });

        if (customers.data && customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            // If no customer is found, create one. This makes the prototype more robust.
            const newCustomer = await stripe.customers.create({
                email: 'test-customer@example.com',
                metadata: {
                    // In a real app, you would associate this with your internal user ID
                    // userId: userId, 
                }
            });
            customerId = newCustomer.id;
        }
        
        try {
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: `${appUrl}/settings`,
            });
            
            return {
                url: portalSession.url,
            };

        } catch (error) {
            console.error('Error creating Stripe customer portal session:', error);
            throw new Error('Failed to create Stripe customer portal session.');
        }
    }
);
