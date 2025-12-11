
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
              Welcome to MoneyPree! These Terms of Service ("Terms") govern your use of our mobile and web application (the "Service") and any related services provided by us. By using our Service, you agree to be bound by these Terms.
            </p>

            <h2>2. AI-Generated Content</h2>
            <p>
              Our Service utilizes artificial intelligence to provide financial insights, suggestions, and educational content. This information is for informational purposes only and does not constitute financial, investment, legal, or tax advice. You should consult with a qualified professional before making any financial decisions. We are not liable for any actions taken based on the AI-generated content.
            </p>

            <h2>3. User Accounts & Data</h2>
            <p>
              Our Service uses an anonymous account system. When you first use the app, a unique, anonymous account is created and stored on your device. All data you enter is tied to this account. You are responsible for the device on which this data is stored. **Please be aware that if you uninstall the application from your device, your anonymous account and all of its associated data will be permanently deleted and cannot be recovered.**
            </p>

            <h2>4. Service Usage</h2>
            <p>
              The Service is provided to you free of charge. We grant you a non-transferable, non-exclusive, revocable, limited license to use and access the Service solely for your own personal, non-commercial use.
            </p>
            
            <h2>5. Limitation of Liability</h2>
            <p>
              In no event shall MoneyPree, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service. This includes any data loss resulting from the uninstallation of the application.
            </p>

            <h2>6. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@moneypree.com.
            </p>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
