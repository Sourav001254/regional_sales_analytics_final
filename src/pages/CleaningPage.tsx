import { Code2 } from 'lucide-react';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';

interface CleaningPageProps {
  codeStr: string;
  handleDownloadPy: () => void;
}

export const CleaningPage = ({ codeStr, handleDownloadPy }: CleaningPageProps) => (
  <StepCard 
    title="Data Cleaning & Transformation"
    description="I've written an advanced, fully commented Python script using pandas. It checks algorithms for handling missing values, removes duplicates, detects outliers via the IQR method (with boxplot visualizations), and adds 7 powerful new features like Days_to_Profit_Breakeven and Customer_Lifetime_Value_Score."
  >
    <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">data_cleaning.py</h3>
        </div>
        <p className="text-xs text-slate-400">
          Pandas • Feature Engineering • IQR Strategy • Cleaned Output
        </p>
      </div>
      <DownloadButton 
        onClick={handleDownloadPy} 
        text="Download Python Script" 
        className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/10" 
      />
    </div>

    <CodeViewer code={codeStr} language="python" />
  </StepCard>
);
