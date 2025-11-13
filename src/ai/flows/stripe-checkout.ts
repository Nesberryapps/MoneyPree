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
  userEmail: z.string().optional().describe("The user's email address."),
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
  async ({ priceId, userId, userEmail }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
        throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set.');
    }

    // Look for an existing customer by userId metadata first.
    const existingCustomers = await stripe.customers.list({
      limit: 1,
      metadata: { userId: userId },
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // If no customer is found, create a new one.
      customer = await stripe.customers.create({
        email: userEmail, // Pass the user's email if available
        metadata: {
          userId: userId, // Store our internal user ID in Stripe's metadata
        },
      });
    }

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
        customer: customer.id, // Use the found or newly created customer
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

        // Find the Stripe Customer ID by looking up the userId in the metadata.
        const customers = await stripe.customers.list({
            limit: 1,
            metadata: { userId: userId },
        });

        if (!customers.data || customers.data.length === 0) {
            // This case should ideally not happen for a Pro user,
            // but we'll handle it gracefully.
            throw new Error('Could not find a subscription for your account.');
        }
        
        const customerId = customers.data[0].id;
        
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
