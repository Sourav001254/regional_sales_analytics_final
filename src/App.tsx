import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useDataset } from './hooks/useDataset';
import { Sidebar } from './components/Sidebar';

// Pages
import { DataGenPage } from './pages/DataGenPage';
import { CleaningPage } from './pages/CleaningPage';
import { EDAPage } from './pages/EDAPage';
import { MLPage } from './pages/MLPage';
import { PowerBIPage } from './pages/PowerBIPage';
import { DocsPage } from './pages/DocsPage';
import { LivePage } from './pages/LivePage';
import { DevOpsPage } from './pages/DevOpsPage';
import { CareerPage } from './pages/CareerPage';

// Raw Imports
import dataCleaningCode from '../data_cleaning.py?raw';
import edaAnalysisCode from '../eda_analysis.py?raw';
import daxMeasuresCode from '../dax_measures.txt?raw';
import powerBiBlueprintMd from '../power_bi_blueprint.md?raw';
import advancedFeaturesCode from '../advanced_features.py?raw';
import generatePptxCode from '../generate_pptx.py?raw';
import readmeMd from '../README.md?raw';
import aiMlLayerCode from '../ai_ml_layer.py?raw';
import liveDashboardCode from '../live_dashboard.py?raw';
import advancedSqlCode from '../advanced_sql.sql?raw';
import proAnalyticsCode from '../pro_analytics.py?raw';
import testDataPipelineCode from '../test_data_pipeline.py?raw';
import generatePdfCode from '../generate_pdf.py?raw';
import githubActionsCode from '../.github/workflows/data_pipeline.yml?raw';
import pbiBuildGuide from '../powerbi_build_guide.md?raw';
import pbiThemeJson from '../powerbi_theme.json?raw';
import erDiagramMd from '../data_model_er_diagram.md?raw';
import requirementsTxt from '../requirements.txt?raw';
import linkedinPostMd from '../linkedin_post.md?raw';
import interviewQaMd from '../interview_qa.md?raw';

export default function App() {
  const { data } = useDataset();
  const [activeStepId, setActiveStepId] = useState(1);

  const handleDownloadPy = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const steps = [
    { id: 1, title: 'Raw Data Source', status: 'completed', desc: 'Generate & Export CSV' },
    { id: 2, title: 'Data Cleaning', status: 'completed', desc: 'Pandas transformation' },
    { id: 3, title: 'EDA & Modeling', status: 'completed', desc: 'Data Visualization' },
    { id: 4, title: 'KPIs & DAX', status: 'completed', desc: 'Measures formulation' },
    { id: 5, title: 'Power BI Design', status: 'completed', desc: 'Blueprint & layout' },
    { id: 6, title: 'Standard AI Models', status: 'completed', desc: 'Basic Clustering & Anomaly' },
    { id: 7, title: 'Documentation', status: 'completed', desc: 'GitHub repo prep' },
    { id: 8, title: 'God-Tier AI/ML Layer', status: 'completed', desc: 'NLQ, SHAP, Explainer' },
    { id: 9, title: 'Live & SQL Layer', status: 'completed', desc: 'Streamlit Real-Time' },
    { id: 10, title: 'Pro Analytics Layer', status: 'completed', desc: 'Churn, Monte Carlo' },
    { id: 11, title: 'CI/CD & DevOps', status: 'completed', desc: 'PDF, Pytest, Actions' },
    { id: 12, title: 'Power BI Masterclass', status: 'completed', desc: 'Actual .pbix build rules' },
    { id: 13, title: 'Portfolio & Career', status: 'completed', desc: 'LinkedIn & Interview QA' },
    { id: 14, title: 'Environment Setup', status: 'completed', desc: 'requirements & .env' }
  ];

  return (
    <div className="min-h-screen bg-[#06101F] text-slate-200 font-sans selection:bg-[#D4AF37] selection:text-[#06101F] flex antialiased">
      <Sidebar steps={steps} activeStepId={activeStepId} setActiveStepId={setActiveStepId} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center px-6 md:px-10 shrink-0 bg-[#0A162B]">
          <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            Project Deliverables <ChevronRight className="w-4 h-4 text-slate-600" /> 
            <span className="text-[#D4AF37]">
              Step {activeStepId} ({steps.find(s => s.id === activeStepId)?.title})
            </span>
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto space-y-8">
            {activeStepId === 1 && <DataGenPage data={data} />}
            {activeStepId === 2 && <CleaningPage codeStr={dataCleaningCode} handleDownloadPy={() => handleDownloadPy(dataCleaningCode, 'data_cleaning.py')} />}
            {activeStepId === 3 && <EDAPage data={data} codeStr={edaAnalysisCode} handleDownloadPy={() => handleDownloadPy(edaAnalysisCode, 'eda_analysis.py')} />}
            {activeStepId === 4 && <PowerBIPage activeTab="dax" daxMeasuresCode={daxMeasuresCode} powerBiBlueprintMd={powerBiBlueprintMd} pbiBuildGuide={pbiBuildGuide} pbiThemeJson={pbiThemeJson} erDiagramMd={erDiagramMd} handleDownloadPy={handleDownloadPy} />}
            {activeStepId === 5 && <PowerBIPage activeTab="blueprint" daxMeasuresCode={daxMeasuresCode} powerBiBlueprintMd={powerBiBlueprintMd} pbiBuildGuide={pbiBuildGuide} pbiThemeJson={pbiThemeJson} erDiagramMd={erDiagramMd} handleDownloadPy={handleDownloadPy} />}
            {activeStepId === 6 && <MLPage activeTab="standard" advancedFeaturesCode={advancedFeaturesCode} aiMlLayerCode={aiMlLayerCode} handleDownloadPy={handleDownloadPy} />}
            {activeStepId === 7 && <DocsPage readmeStr={readmeMd} pptxCode={generatePptxCode} handleDownloadText={handleDownloadPy} />}
            {activeStepId === 8 && <MLPage activeTab="god-tier" advancedFeaturesCode={advancedFeaturesCode} aiMlLayerCode={aiMlLayerCode} handleDownloadPy={handleDownloadPy} />}
            {activeStepId === 9 && <LivePage activeTab="live" sqlCode={advancedSqlCode} streamlitCode={liveDashboardCode} proAnalyticsCode={proAnalyticsCode} handleDownloadText={handleDownloadPy} />}
            {activeStepId === 10 && <LivePage activeTab="pro" sqlCode={advancedSqlCode} streamlitCode={liveDashboardCode} proAnalyticsCode={proAnalyticsCode} handleDownloadText={handleDownloadPy} />}
            {activeStepId === 11 && <DevOpsPage testCode={testDataPipelineCode} pdfCode={generatePdfCode} actionsCode={githubActionsCode} handleDownloadText={handleDownloadPy} />}
            {activeStepId === 12 && <PowerBIPage activeTab="masterclass" daxMeasuresCode={daxMeasuresCode} powerBiBlueprintMd={powerBiBlueprintMd} pbiBuildGuide={pbiBuildGuide} pbiThemeJson={pbiThemeJson} erDiagramMd={erDiagramMd} handleDownloadPy={handleDownloadPy} />}
            {activeStepId === 13 && <CareerPage activeTab="career" linkedin={linkedinPostMd} interview={interviewQaMd} handleDownloadText={handleDownloadPy} />}
            {activeStepId === 14 && <CareerPage activeTab="setup" reqs={requirementsTxt} linkedin={linkedinPostMd} interview={interviewQaMd} handleDownloadText={handleDownloadPy} />}
          </div>
        </div>
      </main>
    </div>
  );
}
