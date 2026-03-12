
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
                  Navigate to the "Budget" page and click the "Add Transaction" button to manually enter details. You can also use the "Scan Receipt" button to automatically fill in details using your device's camera.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How does the AI Business Analysis work?
                </AccordionTrigger>
                <AccordionContent>
                  This feature is available on the "Business" tab. Once you have logged some business transactions, click the "Generate P&L Report" button. After the report is generated, an "Analyze Report" button will appear. Clicking it will provide you with a detailed analysis from our AI, including a performance summary, key trends, and actionable advice.
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
                  First, enable "Voice Interaction" on the "Settings" page. Once enabled, microphone icons (🎤) will appear next to input fields. Click the icon to start dictating. Speaker icons (🔊) will appear next to AI-generated text; click them to have the text read aloud.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How are the AI features monetized?
                </AccordionTrigger>
                <AccordionContent>
                  To support the operational costs of the AI, some features require you to watch a brief ad before generating a result. This allows us to offer these advanced capabilities for free. Thank you for your support!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    
