
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-4">
             <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Information We Collect</h2>
            <p>
                We collect information you provide directly to us, such as when you create an account, enter financial data, or communicate with us. This may include your name, email, and financial information you choose to share.
            </p>
            
            <h2>2. How We Use Your Information</h2>
            <p>
                We use the information we collect to operate, maintain, and provide the features and functionality of the Service, including:
            </p>
            <ul>
                <li>To provide personalized financial insights and suggestions through our AI models.</li>
                <li>To process subscription payments through our third-party provider, Stripe.</li>
                <li>To communicate with you, including sending service-related notices.</li>
            </ul>
            
            <h2>3. AI and Data Processing</h2>
            <p>
                Your financial data may be processed by third-party AI models (such as Google's Gemini) to generate insights. We take steps to ensure that this data is handled securely. We do not use your personal financial data to train general-purpose AI models.
            </p>
            
            <h2>4. Third-Party Services</h2>
            <p>
                We use third-party services like Firebase for authentication and database management, Stripe for payments, and Plaid for bank account connections. These services have their own privacy policies, and we encourage you to review them.
            </p>
            
            <h2>5. Data Security</h2>
            <p>
                We implement reasonable security measures to protect your information. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
            </p>
            
            <h2>6. Your Choices</h2>
            <p>
                You can access and update your account information through your account settings. You can also cancel your subscription and request deletion of your account data by contacting us.
            </p>
            
            <h2>7. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@moneypree-placeholder.com.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
