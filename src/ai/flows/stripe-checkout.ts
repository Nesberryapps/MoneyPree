'use server';

/**
 * @fileOverview This file contains the Genkit flow for creating a Stripe Checkout session.
 * 
 * - createCheckoutSession - Creates a Stripe Checkout session for a given price ID.
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
  sessionId: z.string().describe('The ID of the created Stripe Checkout session.'),
});
export type CheckoutSessionOutput = z.infer<typeof CheckoutSessionOutputSchema>;

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
        // Make sure to configure these URLs in your Next.js app
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      });

      if (!session.id) {
        throw new Error('Could not create Stripe session.');
      }

      return {
        sessionId: session.id,
      };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Failed to create Stripe checkout session.');
    }
  }
);
