
'use server';

/**
 * @fileOverview This file contains Genkit flows for interacting with the Plaid API.
 * It handles creating link tokens for the frontend and exchanging public tokens for access tokens.
 * 
 * - createLinkToken - Creates a link_token for Plaid Link initialization.
 * - setAccessToken - Exchanges a public_token for an access_token.
 * - getTransactions - Fetches transactions for a given access_token.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  PlaidApi,
  Configuration,
  PlaidEnvironments,
  CountryCode,
  Products,
  TransactionsSyncRequest,
} from 'plaid';
import type { Transaction } from 'plaid';

const PlaidFlowInputSchema = z.object({
  userId: z.string().describe('The unique identifier for the user.'),
});
export type PlaidFlowInput = z.infer<typeof PlaidFlowInputSchema>;

const PlaidLinkTokenOutputSchema = z.object({
  link_token: z.string(),
  expiration: z.string(),
});
export type PlaidLinkTokenOutput = z.infer<typeof PlaidLinkTokenOutputSchema>;

const PlaidPublicTokenInputSchema = z.object({
  public_token: z.string(),
  userId: z.string(), // We'll need this to associate the access token with the user later
});
export type PlaidPublicTokenInput = z.infer<typeof PlaidPublicTokenInputSchema>;

const PlaidAccessTokenOutputSchema = z.object({
  access_token: z.string(),
  item_id: z.string(),
});
export type PlaidAccessTokenOutput = z.infer<
  typeof PlaidAccessTokenOutputSchema
>;

const GetTransactionsInputSchema = z.object({
    accessToken: z.string().describe("The Plaid access token for the item."),
});
export type GetTransactionsInput = z.infer<typeof GetTransactionsInputSchema>;

// Note: We use z.any() here because the Plaid Transaction object is very complex.
// We will rely on TypeScript for type safety on the client.
const GetTransactionsOutputSchema = z.object({
    transactions: z.array(z.any()).describe("An array of transactions."),
});
export type GetTransactionsOutput = {
    transactions: Transaction[];
};


const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function createLinkToken(
  input: PlaidFlowInput
): Promise<PlaidLinkTokenOutput> {
  return createLinkTokenFlow(input);
}

const createLinkTokenFlow = ai.defineFlow(
  {
    name: 'createLinkTokenFlow',
    inputSchema: PlaidFlowInputSchema,
    outputSchema: PlaidLinkTokenOutputSchema,
  },
  async ({ userId }) => {
    const request = {
      user: {
        client_user_id: userId,
      },
      client_name: 'MoneyPree',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    try {
      const response = await plaidClient.linkTokenCreate(request);
      return {
        link_token: response.data.link_token,
        expiration: response.data.expiration,
      };
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      throw new Error('Failed to create Plaid link token.');
    }
  }
);


export async function setAccessToken(
  input: PlaidPublicTokenInput
): Promise<PlaidAccessTokenOutput> {
  return setAccessTokenFlow(input);
}

const setAccessTokenFlow = ai.defineFlow({
    name: 'setAccessTokenFlow',
    inputSchema: PlaidPublicTokenInputSchema,
    outputSchema: PlaidAccessTokenOutputSchema,
}, async ({ public_token, userId }) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // CRITICAL STEP: In a real application, you MUST save the access_token and item_id
        // securely in your database (e.g., Firestore) and associate them with the `userId`.
        // The access_token is a permanent key to the user's financial data.
        // For this prototype, we are just returning it.
        console.log(`Access token for user ${userId}: ${accessToken}`);

        return {
            access_token: accessToken,
            item_id: itemId,
        };
    } catch (error) {
        console.error('Error exchanging public token:', error);
        throw new Error('Failed to exchange public token for access token.');
    }
});

export async function getTransactions(input: GetTransactionsInput): Promise<GetTransactionsOutput> {
    return getTransactionsFlow(input);
}

const getTransactionsFlow = ai.defineFlow({
    name: 'getTransactionsFlow',
    inputSchema: GetTransactionsInputSchema,
    outputSchema: GetTransactionsOutputSchema,
}, async ({ accessToken }) => {
    // This flow is simplified for the prototype. In a real app, you would manage the cursor
    // to only fetch new transactions since the last sync.
    const request: TransactionsSyncRequest = {
        access_token: accessToken,
    };

    try {
        const response = await plaidClient.transactionsSync(request);
        let transactions = response.data.added;
        
        // In a full implementation, you'd also handle `modified` and `removed` transactions.
        
        return {
            transactions,
        };

    } catch(error) {
        console.error('Error fetching Plaid transactions:', error);
        throw new Error('Failed to fetch Plaid transactions.');
    }
});
