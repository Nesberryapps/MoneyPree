import { Header } from '@/components/layout/header';
import { ExpertQA } from '@/components/qa/expert-qa';

export default function QAPage() {
  return (
    <div className="flex flex-col">
      <Header title="Expert Q&A" />
      <main className="flex-1 p-4 md:p-8">
        <ExpertQA />
      </main>
    </div>
  );
}
