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
      <Header title="Help & FAQ" />
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
                  Navigate to the "Budget" page and click the "Add Transaction"
                  button. A dialog will appear where you can enter the details
                  of your income or expense.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can the AI help me set financial goals?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! Go to the "Goals" page and use the "AI Goal Generator".
                  Describe your financial dreams, and the AI will suggest
                  specific, actionable goals for you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How does the Investment Simulator work?
                </AccordionTrigger>
                <AccordionContent>
                  On the "Invest" page, you can input your current assets and
                  investment goals. The AI will analyze your information and
                  suggest a diversified portfolio, assess risks, and estimate
                  potential returns. It can consider a wide range of
                  investments, including real estate and business ventures.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How do I change the application's theme?
                </AccordionTrigger>
                <AccordionContent>
                  You can change the theme by going to the "Settings" page.
                  There you will find options to switch between light, dark, and
                  system themes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
