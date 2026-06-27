import { FileBox, FileText, Presentation } from 'lucide-react';
import Markdown from 'react-markdown';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';

interface DocsPageProps {
  readmeStr: string;
  pptxCode: string;
  handleDownloadText: (content: string, name: string) => void;
}

export const DocsPage = ({ readmeStr, pptxCode, handleDownloadText }: DocsPageProps) => {
  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-12 fade-in duration-500">
      <StepCard
        title="Project Documentation"
        description="The project requires professional documentation. A README.md is generated detailing the system architecture, setup instructions, problem statements, and key discovered insights ready for a corporate Github Portfolio."
      >
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-[#111F38] p-6 md:flex-row">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <FileBox className="h-5 w-5 text-slate-300" />
              <h3 className="font-semibold text-white">README.md</h3>
            </div>
            <p className="text-xs text-slate-400">Architecture | Setup Docs | Project Delivery</p>
          </div>
          <DownloadButton
            onClick={() => handleDownloadText(readmeStr, 'README.md')}
            text="Download README"
            className="bg-slate-700 text-white hover:bg-slate-600"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0A162B] shadow-sm">
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-800 bg-[#0A162B]/80 p-4">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-200">README Preview</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto bg-[#06101F] p-6 md:p-8">
            <div className="markdown-body prose prose-invert prose-slate max-w-none p-0 text-sm prose-a:text-sky-400 prose-headings:text-white prose-strong:text-slate-200">
              <Markdown>{readmeStr}</Markdown>
            </div>
          </div>
        </div>
      </StepCard>

      <div className="border-t border-slate-800 pt-8">
        <StepCard
          title="Auto Presentation Builder"
          description="A script employing python-pptx designed to dynamically read the AI-generated insights and charts, exporting a formatted slide deck to deliver directly to stakeholders without manual overhead."
        >
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-[#111F38] p-6 md:flex-row">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Presentation className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-white">generate_pptx.py</h3>
              </div>
              <p className="text-xs text-slate-400">python-pptx | Auto Slides | Exec Summary Generator</p>
            </div>
            <DownloadButton
              onClick={() => handleDownloadText(pptxCode, 'generate_pptx.py')}
              text="Download PPTX Script"
              className="bg-orange-600 text-white shadow-orange-500/10 hover:bg-orange-500"
            />
          </div>
        </StepCard>
      </div>
    </div>
  );
};
