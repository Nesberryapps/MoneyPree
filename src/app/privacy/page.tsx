
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
                Our service uses anonymous accounts provided by Firebase Authentication. We do not require or store personal information like your name or email address. All financial data you enter, such as transactions and goals, is associated with this anonymous account, which is stored locally on your device.
            </p>
            
            <h2>2. How We Use Your Information</h2>
            <p>
                We use the information we collect solely to operate, maintain, and provide the features and functionality of the Service, including:
            </p>
            <ul>
                <li>To save and display your financial data on your device.</li>
                <li>To provide personalized financial insights and other suggestions through our AI models.</li>
                <li>To communicate with you, including sending service-related notices.</li>
            </ul>
            
            <h2>3. AI and Data Processing</h2>
            <p>
                Your financial data (such as transaction lists and amounts) may be sent to third-party AI models (e.g., Google's Gemini) to generate insights and analysis. We take steps to ensure that this data is handled securely and in accordance with our partners' privacy policies. We do not use your personal financial data to train general-purpose AI models.
            </p>
            
            <h2>4. Third-Party Services</h2>
            <p>
                We use Firebase for anonymous authentication and to store your data. Firebase is essential for the app's functionality and has its own privacy policy, which we encourage you to review. We are not responsible for the privacy practices of third parties.
            </p>
            
            <h2>5. Data Security and Retention</h2>
            <p>
                We implement reasonable security measures, including Firestore Security Rules, to protect your information from unauthorized access. Your data is tied to your anonymous account, which is stored on your device. **If you delete the app, your account and all associated data will be permanently lost and cannot be recovered.**
            </p>
            
            <h2>6. Your Choices</h2>
            <p>
                As your account is anonymous, there is no personal account information to update. You are in full control of your data; you can delete individual data points within the app or delete all data by uninstalling the app.
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
