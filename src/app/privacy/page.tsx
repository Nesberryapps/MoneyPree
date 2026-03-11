
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
              Our service uses anonymous accounts provided by Firebase Authentication. We do not require or store personally identifiable information like your name or email address, as there is no user sign-up process. All financial data you enter, such as transactions and goals, is associated with a unique anonymous account that is stored locally on your device or within your app installation.
            </p>
            
            <h2>2. How We Use Your Information</h2>
            <p>
              The financial data you provide is used solely to operate, maintain, and provide the features and functionality of the Service. This includes:
            </p>
            <ul>
                <li>Saving and displaying your financial data within the app.</li>
                <li>Providing personalized financial insights and other suggestions through our integrated AI models.</li>
                <li>Using aggregated, anonymized data to improve our services.</li>
            </ul>
            
            <h2>3. AI and Data Processing</h2>
            <p>
              Your financial data (such as transaction lists and amounts) may be sent to third-party AI models (e.g., Google's Gemini) to generate insights and analysis. We take steps to ensure that this data is handled securely. We do not use your personal financial data to train general-purpose AI models.
            </p>
            
            <h2>4. Third-Party Services</h2>
            <p>
                We use the following third-party services which are essential for the app's functionality:
            </p>
            <ul>
                <li>**Firebase:** For anonymous authentication and secure data storage.</li>
                <li>**Google AdMob:** To serve advertisements that grant access to certain features. AdMob may collect device information to serve relevant ads.</li>
            </ul>
            <p>We encourage you to review the privacy policies of these third parties. We are not responsible for their privacy practices.</p>
            
            <h2>5. Data Security and Retention</h2>
            <p>
                We implement reasonable security measures, including Firestore Security Rules, to protect your information from unauthorized access. Your data is tied to your anonymous account. **If you uninstall the app or clear its data, your account and all associated financial data will be permanently lost and cannot be recovered.**
            </p>
            
            <h2>6. Your Choices</h2>
            <p>
                As your account is anonymous, there is no personal account information to manage. You are in full control of your data within the app and can delete it at any time. Deleting the application will permanently remove all associated data.
            </p>
            
            <h2>7. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@moneypree.com.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
