

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="w-full p-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">MoneyPree</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-4">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to MoneyPree! These Terms of Service ("Terms") govern your use of our web application (the "Service") and any related services provided by us. By using our Service, you agree to be bound by these Terms.
            </p>

            <h2>2. AI-Generated Content</h2>
            <p>
              Our Service utilizes artificial intelligence to provide financial insights, suggestions, and educational content. This information is for informational purposes only and does not constitute financial, investment, legal, or tax advice. You should consult with a qualified professional before making any financial decisions. We are not liable for any actions taken based on the AI-generated content.
            </p>

            <h2>3. Third-Party Services (Plaid & Stripe)</h2>
             <p>
                To provide features like bank account syncing and premium subscriptions, we use third-party services such as Plaid and Stripe. When you connect your bank account, you are agreeing to Plaid's terms of service and privacy policy. Subscription payments are processed by Stripe and are subject to their terms. MoneyPree is not responsible for the data or services provided by these third parties.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              To access certain features of our Service, you may need to create an account. You are responsible for safeguarding your account information and for any activities or actions under your account.
            </p>
            
            <h2>5. Subscriptions</h2>
            <p>
              Some parts of the Service are billed on a subscription basis ("MoneyPree Pro"). You will be billed in advance on a recurring and periodic basis (e.g., monthly). Subscriptions automatically renew unless canceled at least 24 hours before the renewal date. You can manage your subscription and cancel anytime through the Stripe Customer Portal, which is accessible via your account settings. Payments are non-refundable.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall MoneyPree, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@moneypree-placeholder.com.
            </p>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
