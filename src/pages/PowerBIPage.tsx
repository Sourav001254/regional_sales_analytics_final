import { Calculator, LayoutDashboard, MonitorPlay, FileBox, Palette, Network } from 'lucide-react';
import Markdown from 'react-markdown';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';

interface PowerBIPageProps {
  daxMeasuresCode: string;
  powerBiBlueprintMd: string;
  pbiBuildGuide: string;
  pbiThemeJson: string;
  erDiagramMd: string;
  handleDownloadPy: (code: string, filename: string) => void;
  activeTab: 'dax' | 'blueprint' | 'masterclass';
}

export const PowerBIPage = ({ daxMeasuresCode, powerBiBlueprintMd, pbiBuildGuide, pbiThemeJson, erDiagramMd, handleDownloadPy, activeTab }: PowerBIPageProps) => {
  if (activeTab === 'dax') {
    return (
      <StepCard 
        title="KPI Definition & DAX Measures"
        description="I've formulated a complete set of advanced Power BI DAX measures covering Sales capabilities, robust Time Intelligence (YTD, SPLY, Rolling averages), and complex evaluation formulas like Top N parameters, RFM segmentation logic via SWITCH, and What-if discount variables."
      >
        <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-white">dax_measures.txt</h3>
            </div>
            <p className="text-xs text-slate-400">
              20+ DAX Functions • Time Intelligence • Scenarios
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadPy(daxMeasuresCode, 'dax_measures.txt')} 
            text="Download DAX Measures" 
            className="bg-amber-500 hover:bg-amber-400 text-[#0A162B] shadow-amber-500/10" 
          />
        </div>

        <CodeViewer code={daxMeasuresCode} language="dax" title="DAX Preview" icon="code" />
      </StepCard>
    );
  }

  if (activeTab === 'blueprint') {
    return (
      <StepCard 
        title="Power BI Dashboard Blueprint"
        description="A fully structured, 6-page professional Power BI report design document. It details the visual choices, spatial arrangement, cross-functional filtering tactics, and bookmarks required to build an executive-grade presentation."
      >
        <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-5 h-5 text-sky-400" />
              <h3 className="font-semibold text-white">power_bi_blueprint.md</h3>
            </div>
            <p className="text-xs text-slate-400">
              6 Pages • Theme Guidelines • Navigation Structure
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadPy(powerBiBlueprintMd, 'power_bi_blueprint.md')} 
            text="Download Blueprint" 
            className="bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/10" 
          />
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A162B] shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-[#0A162B]/80 sticky top-0 z-10">
            <LayoutDashboard className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-medium text-slate-200">Markdown Preview</h3>
          </div>
          <div className="overflow-y-auto max-h-[600px] p-6 md:p-8 bg-[#06101F]">
             <div className="prose prose-invert prose-slate prose-headings:text-white prose-a:text-sky-400 prose-strong:text-slate-200 p-0 max-w-none text-sm markdown-body">
               <Markdown>{powerBiBlueprintMd}</Markdown>
             </div>
          </div>
        </div>
      </StepCard>
    );
  }

  return (
    <StepCard 
      title="Power BI Masterclass"
      description="Provides the exact instructions, schema design, and custom theme file to build this visualization engine in Power BI Desktop flawlessly."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111F38] border border-[#F2CE57]/20 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FileBox className="w-5 h-5 text-[#F2CE57]" />
              <h3 className="font-semibold text-white">powerbi_build_guide.md</h3>
            </div>
            <p className="text-xs text-[#F2CE57]/70">Step-by-step UI clicking instructions for Desktop.</p>
            <DownloadButton 
              onClick={() => handleDownloadPy(pbiBuildGuide, 'powerbi_build_guide.md')} 
              text="Download Guide" 
              className="bg-[#F2CE57]/10 hover:bg-[#F2CE57]/20 text-[#F2CE57] border border-[#F2CE57]/30" 
            />
        </div>

        <div className="bg-[#111F38] border border-emerald-500/20 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">powerbi_theme.json</h3>
            </div>
            <p className="text-xs text-emerald-400/70">Dark Navy + Gold luxurious JSON styling.</p>
            <DownloadButton 
              onClick={() => handleDownloadPy(pbiThemeJson, 'powerbi_theme.json')} 
              text="Download Theme" 
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
            />
        </div>
      </div>

      <div className="bg-[#111F38] border border-cyan-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">data_model_er_diagram.md</h3>
            </div>
            <p className="text-xs text-cyan-400/70">
              Fact_Sales + Dim_Product + Dim_Customer Star Schema
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadPy(erDiagramMd, 'data_model_er_diagram.md')} 
            text="Download ER Diagram" 
            className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20" 
          />
      </div>
    </StepCard>
  );
};
