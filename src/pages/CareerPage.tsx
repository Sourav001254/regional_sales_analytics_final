import { Link, FileBadge, Lightbulb, TerminalSquare, Code2 } from 'lucide-react';
import { DownloadButton } from '../components/DownloadButton';

interface CareerPageProps {
  linkedin: string;
  interview: string;
  reqs?: string;
  handleDownloadText: (content: string, name: string) => void;
  activeTab: 'career' | 'setup';
}

export const CareerPage = ({ linkedin, interview, reqs, handleDownloadText, activeTab }: CareerPageProps) => {
  if (activeTab === 'setup' && reqs !== undefined) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3 flex items-center gap-2">
            <TerminalSquare className="w-8 h-8 text-neutral-400" />
            Environment Setup
          </h1>
          <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
            Provides standard pip requirements file to make this project reproducible on any machine.
          </p>
        </div>

        <div className="bg-[#111F38] border border-neutral-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-neutral-300" />
              <h3 className="font-semibold text-white">requirements.txt</h3>
            </div>
            <p className="text-xs text-neutral-400">
              All 15+ python libraries mapped to stable versions.
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadText(reqs, 'requirements.txt')} 
            text="Download Requirements" 
            className="bg-neutral-600 hover:bg-neutral-500 text-white" 
          />
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A162B] shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-[#0A162B]/80 sticky top-0 z-10">
            <TerminalSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-200">.env Example (For Gemini API)</h3>
          </div>
          <div className="overflow-y-auto max-h-[400px] p-6 md:p-8 bg-[#06101F]">
             <pre className="text-sm text-emerald-400 font-mono">
{`# Create a file named .env in your root directory
# Add your Google Gemini API key to activate the NLQ layer

GEMINI_API_KEY="YOUR_API_KEY_HERE"
`}
             </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3 flex items-center gap-2">
          <Link className="w-8 h-8 text-blue-500" />
          Portfolio & Career Deployment
        </h1>
        <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
          The code means nothing if you can't sell it. Use these assets to maximize your visibility during placement season and ace the technical grilling.
        </p>
      </div>

      <div className="bg-[#111F38] border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileBadge className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">linkedin_post.md</h3>
          </div>
          <p className="text-xs text-blue-400/70">
            High-hook, metrics-driven post ready for LinkedIn.
          </p>
        </div>
        <DownloadButton 
          onClick={() => handleDownloadText(linkedin, 'linkedin_post.md')} 
          text="Download Post" 
          className="bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20" 
        />
      </div>

      <div className="bg-[#111F38] border border-rose-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold text-white">interview_qa.md</h3>
          </div>
          <p className="text-xs text-rose-400/70">
            7 detailed QA scripts covering XGBoost, SHAP, DAX logic, and Star Schemas.
          </p>
        </div>
        <DownloadButton 
          onClick={() => handleDownloadText(interview, 'interview_qa.md')} 
          text="Download Q&A Doc" 
          className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20" 
        />
      </div>
    </div>
  );
};
