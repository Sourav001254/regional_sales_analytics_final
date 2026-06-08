import { Rocket, CheckCircle2, FileBox, Workflow } from 'lucide-react';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';

interface DevOpsPageProps {
  testCode: string;
  pdfCode: string;
  actionsCode: string;
  handleDownloadText: (content: string, name: string) => void;
}

export const DevOpsPage = ({ testCode, pdfCode, actionsCode, handleDownloadText }: DevOpsPageProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3 flex items-center gap-2">
          <Rocket className="w-8 h-8 text-orange-400" />
          Production & CI/CD Layer
        </h1>
        <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
          Turns scripts into enterprise software. Generates branded PDF reports using ReportLab, enforces strict logic gates via Pytest, and orchestrates the entire workflow utilizing a GitHub Actions YAML pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111F38] border border-orange-500/20 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-white">test_data_pipeline.py</h3>
          </div>
          <p className="text-xs text-orange-400/70">Pytest Suite</p>
          <DownloadButton 
            onClick={() => handleDownloadText(testCode, 'test_data_pipeline.py')} 
            text="Download test_data_pipeline.py" 
            className="bg-orange-600 hover:bg-orange-500 text-white" 
          />
        </div>

        <div className="bg-[#111F38] border border-orange-500/20 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FileBox className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-white">generate_pdf.py</h3>
          </div>
          <p className="text-xs text-orange-400/70">ReportLab PDFs</p>
          <DownloadButton 
            onClick={() => handleDownloadText(pdfCode, 'generate_pdf.py')} 
            text="Download generate_pdf.py" 
            className="bg-orange-600 hover:bg-orange-500 text-white" 
          />
        </div>

        <div className="bg-[#111F38] border border-orange-500/20 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Workflow className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-white truncate" title="data_pipeline.yml">data_pipeline.yml</h3>
          </div>
          <p className="text-xs text-orange-400/70">GitHub Actions CI/CD</p>
          <DownloadButton 
            onClick={() => handleDownloadText(actionsCode, 'data_pipeline.yml')} 
            text="Download data_pipeline.yml" 
            className="bg-orange-600 hover:bg-orange-500 text-white" 
          />
        </div>
      </div>

      <div className="space-y-6">
        <CodeViewer code={testCode} language="python" title="test_data_pipeline.py Preview" icon="code" />
        <CodeViewer code={pdfCode} language="python" title="generate_pdf.py Preview" icon="code" />
        <CodeViewer code={actionsCode} language="yaml" title="data_pipeline.yml Preview" icon="code" />
      </div>
    </div>
  );
};
