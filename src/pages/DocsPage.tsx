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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <StepCard 
        title="Project Documentation"
        description="The project requires professional documentation. A README.md is generated detailing the system architecture, setup instructions, problem statements, and key discovered insights ready for a corporate Github Portfolio."
      >
        <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileBox className="w-5 h-5 text-slate-300" />
              <h3 className="font-semibold text-white">README.md</h3>
            </div>
            <p className="text-xs text-slate-400">
              Architecture • Setup Docs • Project Delivery
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadText(readmeStr, 'README.md')} 
            text="Download README" 
            className="bg-slate-700 hover:bg-slate-600 text-white" 
          />
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A162B] shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-[#0A162B]/80 sticky top-0 z-10">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-200">README Preview</h3>
          </div>
          <div className="overflow-y-auto max-h-[400px] p-6 md:p-8 bg-[#06101F]">
             <div className="prose prose-invert prose-slate prose-headings:text-white prose-a:text-sky-400 prose-strong:text-slate-200 p-0 max-w-none text-sm markdown-body">
               <Markdown>{readmeStr}</Markdown>
             </div>
          </div>
        </div>
      </StepCard>

      <div className="pt-8 border-t border-slate-800">
        <StepCard 
          title="Auto Presentation Builder"
          description="A script employing python-pptx designed to dynamically read the AI-generated insights and charts, exporting a formatted slide deck to deliver directly to stakeholders without manual overhead."
        >
          <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Presentation className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-white">generate_pptx.py</h3>
              </div>
              <p className="text-xs text-slate-400">
                python-pptx • Auto Slides • Exec Summary Generator
              </p>
            </div>
            <DownloadButton 
              onClick={() => handleDownloadText(pptxCode, 'generate_pptx.py')} 
              text="Download PPTX Script" 
              className="bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/10" 
            />
          </div>
        </StepCard>
      </div>
    </div>
  );
};
