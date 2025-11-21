
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I add a new transaction?
                </AccordionTrigger>
                <AccordionContent>
                  Navigate to the "Budget" page and click the "Add Transaction" button to manually enter details. Pro users can also use the "Scan Receipt" button to automatically fill in details using their device's camera.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How does the AI Business Analysis work?
                </AccordionTrigger>
                <AccordionContent>
                  This is a Pro feature available on the "Business" tab. Once you have logged some business transactions, click the "Generate P&L Report" button. After the report is generated, an "Analyze Report" button will appear. Clicking it will provide you with a detailed analysis from our AI, including a performance summary, key trends, and actionable advice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How does the Investment Simulator work?
                </AccordionTrigger>
                <AccordionContent>
                  On the "Invest" page, you can input your current assets and investment goals. The AI will analyze your information and
                  suggest a diversified portfolio, assess risks, and estimate potential returns. It can consider a wide range of
                  investments, including real estate and business ventures.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-5">
                <AccordionTrigger>
                  How do I use voice commands?
                </AccordionTrigger>
                <AccordionContent>
                  Voice interaction is a Pro feature. First, enable "Voice Interaction" on the "Settings" page. Once enabled, microphone icons (🎤) will appear next to input fields. Click the icon to start dictating. Speaker icons (🔊) will appear next to AI-generated text; click them to have the text read aloud.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How do I manage my Pro subscription?
                </AccordionTrigger>
                <AccordionContent>
                  You can manage your subscription by going to the "Settings" page and clicking the "Manage Subscription" button. This will open the Stripe customer portal where you can update your payment method, view invoices, or cancel your subscription.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    
