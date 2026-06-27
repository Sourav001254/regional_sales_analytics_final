import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useDataset } from './hooks/useDataset';
import { Sidebar } from './components/Sidebar';

const DataGenPage = lazy(() => import('./pages/DataGenPage').then((module) => ({ default: module.DataGenPage })));
const CleaningPage = lazy(() => import('./pages/CleaningPage').then((module) => ({ default: module.CleaningPage })));
const EDAPage = lazy(() => import('./pages/EDAPage').then((module) => ({ default: module.EDAPage })));
const MLPage = lazy(() => import('./pages/MLPage').then((module) => ({ default: module.MLPage })));
const PowerBIPage = lazy(() => import('./pages/PowerBIPage').then((module) => ({ default: module.PowerBIPage })));
const DocsPage = lazy(() => import('./pages/DocsPage').then((module) => ({ default: module.DocsPage })));
const LivePage = lazy(() => import('./pages/LivePage').then((module) => ({ default: module.LivePage })));
const DevOpsPage = lazy(() => import('./pages/DevOpsPage').then((module) => ({ default: module.DevOpsPage })));
const CareerPage = lazy(() => import('./pages/CareerPage').then((module) => ({ default: module.CareerPage })));

type StepAssets = Record<string, string>;

const loadPowerBIAssets = async (): Promise<StepAssets> => ({
  daxMeasuresCode: (await import('../dax_measures.txt?raw')).default,
  powerBiBlueprintMd: (await import('../power_bi_blueprint.md?raw')).default,
  pbiBuildGuide: (await import('../powerbi_build_guide.md?raw')).default,
  pbiThemeJson: (await import('../powerbi_theme.json?raw')).default,
  erDiagramMd: (await import('../data_model_er_diagram.md?raw')).default,
});

const loadMlAssets = async (): Promise<StepAssets> => ({
  advancedFeaturesCode: (await import('../advanced_features.py?raw')).default,
  aiMlLayerCode: (await import('../ai_ml_layer.py?raw')).default,
});

const loadLiveAssets = async (): Promise<StepAssets> => ({
  advancedSqlCode: (await import('../advanced_sql.sql?raw')).default,
  liveDashboardCode: (await import('../live_dashboard.py?raw')).default,
  proAnalyticsCode: (await import('../pro_analytics.py?raw')).default,
});

const loadCareerAssets = async (): Promise<StepAssets> => ({
  requirementsTxt: (await import('../requirements.txt?raw')).default,
  linkedinPostMd: (await import('../linkedin_post.md?raw')).default,
  interviewQaMd: (await import('../interview_qa.md?raw')).default,
});

const stepAssetLoaders: Partial<Record<number, () => Promise<StepAssets>>> = {
  2: async () => ({
    dataCleaningCode: (await import('../data_cleaning.py?raw')).default,
  }),
  3: async () => ({
    edaAnalysisCode: (await import('../eda_analysis.py?raw')).default,
  }),
  4: loadPowerBIAssets,
  5: loadPowerBIAssets,
  6: loadMlAssets,
  7: async () => ({
    generatePptxCode: (await import('../generate_pptx.py?raw')).default,
    readmeMd: (await import('../README.md?raw')).default,
  }),
  8: loadMlAssets,
  9: loadLiveAssets,
  10: loadLiveAssets,
  11: async () => ({
    testDataPipelineCode: (await import('../test_data_pipeline.py?raw')).default,
    generatePdfCode: (await import('../generate_pdf.py?raw')).default,
    githubActionsCode: (await import('../.github/workflows/data_pipeline.yml?raw')).default,
  }),
  12: loadPowerBIAssets,
  13: loadCareerAssets,
  14: loadCareerAssets,
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
  { id: 14, title: 'Environment Setup', status: 'completed', desc: 'requirements & .env' },
];

export default function App() {
  const { data } = useDataset();
  const [activeStepId, setActiveStepId] = useState(1);
  const [stepAssets, setStepAssets] = useState<Partial<Record<number, StepAssets>>>({});
  const [loadingStepId, setLoadingStepId] = useState<number | null>(null);

  useEffect(() => {
    const loader = stepAssetLoaders[activeStepId];
    if (!loader || stepAssets[activeStepId]) {
      return;
    }

    let cancelled = false;
    setLoadingStepId(activeStepId);

    loader()
      .then((assets) => {
        if (cancelled) {
          return;
        }

        setStepAssets((current) => ({
          ...current,
          [activeStepId]: assets,
        }));
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingStepId((current) => (current === activeStepId ? null : current));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeStepId, stepAssets]);

  const currentStep = useMemo(
    () => steps.find((step) => step.id === activeStepId) ?? steps[0],
    [activeStepId],
  );

  const handleDownloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeAssets = stepAssets[activeStepId];

  const renderActiveStep = () => {
    switch (activeStepId) {
      case 1:
        return <DataGenPage data={data} />;
      case 2:
        return activeAssets ? (
          <CleaningPage
            codeStr={activeAssets.dataCleaningCode}
            handleDownloadPy={() => handleDownloadText(activeAssets.dataCleaningCode, 'data_cleaning.py')}
          />
        ) : null;
      case 3:
        return activeAssets ? (
          <EDAPage
            data={data}
            codeStr={activeAssets.edaAnalysisCode}
            handleDownloadPy={() => handleDownloadText(activeAssets.edaAnalysisCode, 'eda_analysis.py')}
          />
        ) : null;
      case 4:
        return activeAssets ? (
          <PowerBIPage
            activeTab="dax"
            daxMeasuresCode={activeAssets.daxMeasuresCode}
            powerBiBlueprintMd={activeAssets.powerBiBlueprintMd}
            pbiBuildGuide={activeAssets.pbiBuildGuide}
            pbiThemeJson={activeAssets.pbiThemeJson}
            erDiagramMd={activeAssets.erDiagramMd}
            handleDownloadPy={handleDownloadText}
          />
        ) : null;
      case 5:
        return activeAssets ? (
          <PowerBIPage
            activeTab="blueprint"
            daxMeasuresCode={activeAssets.daxMeasuresCode}
            powerBiBlueprintMd={activeAssets.powerBiBlueprintMd}
            pbiBuildGuide={activeAssets.pbiBuildGuide}
            pbiThemeJson={activeAssets.pbiThemeJson}
            erDiagramMd={activeAssets.erDiagramMd}
            handleDownloadPy={handleDownloadText}
          />
        ) : null;
      case 6:
        return activeAssets ? (
          <MLPage
            activeTab="standard"
            advancedFeaturesCode={activeAssets.advancedFeaturesCode}
            aiMlLayerCode={activeAssets.aiMlLayerCode}
            handleDownloadPy={handleDownloadText}
          />
        ) : null;
      case 7:
        return activeAssets ? (
          <DocsPage
            readmeStr={activeAssets.readmeMd}
            pptxCode={activeAssets.generatePptxCode}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      case 8:
        return activeAssets ? (
          <MLPage
            activeTab="god-tier"
            advancedFeaturesCode={activeAssets.advancedFeaturesCode}
            aiMlLayerCode={activeAssets.aiMlLayerCode}
            handleDownloadPy={handleDownloadText}
          />
        ) : null;
      case 9:
        return activeAssets ? (
          <LivePage
            activeTab="live"
            sqlCode={activeAssets.advancedSqlCode}
            streamlitCode={activeAssets.liveDashboardCode}
            proAnalyticsCode={activeAssets.proAnalyticsCode}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      case 10:
        return activeAssets ? (
          <LivePage
            activeTab="pro"
            sqlCode={activeAssets.advancedSqlCode}
            streamlitCode={activeAssets.liveDashboardCode}
            proAnalyticsCode={activeAssets.proAnalyticsCode}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      case 11:
        return activeAssets ? (
          <DevOpsPage
            testCode={activeAssets.testDataPipelineCode}
            pdfCode={activeAssets.generatePdfCode}
            actionsCode={activeAssets.githubActionsCode}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      case 12:
        return activeAssets ? (
          <PowerBIPage
            activeTab="masterclass"
            daxMeasuresCode={activeAssets.daxMeasuresCode}
            powerBiBlueprintMd={activeAssets.powerBiBlueprintMd}
            pbiBuildGuide={activeAssets.pbiBuildGuide}
            pbiThemeJson={activeAssets.pbiThemeJson}
            erDiagramMd={activeAssets.erDiagramMd}
            handleDownloadPy={handleDownloadText}
          />
        ) : null;
      case 13:
        return activeAssets ? (
          <CareerPage
            activeTab="career"
            linkedin={activeAssets.linkedinPostMd}
            interview={activeAssets.interviewQaMd}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      case 14:
        return activeAssets ? (
          <CareerPage
            activeTab="setup"
            reqs={activeAssets.requirementsTxt}
            linkedin={activeAssets.linkedinPostMd}
            interview={activeAssets.interviewQaMd}
            handleDownloadText={handleDownloadText}
          />
        ) : null;
      default:
        return null;
    }
  };

  const isLoadingStep = activeStepId !== 1 && (!activeAssets || loadingStepId === activeStepId);

  return (
    <div className="flex min-h-screen bg-[#06101F] font-sans text-slate-200 antialiased selection:bg-[#D4AF37] selection:text-[#06101F]">
      <Sidebar steps={steps} activeStepId={activeStepId} setActiveStepId={setActiveStepId} />

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center border-b border-slate-800 bg-[#0A162B] px-6 md:px-10">
          <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
            Project Deliverables <ChevronRight className="h-4 w-4 text-slate-600" />
            <span className="text-[#D4AF37]">
              Step {activeStepId} ({currentStep.title})
            </span>
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-800 bg-[#111F38] p-8">
                  <div className="mb-3 h-3 w-40 animate-pulse rounded bg-slate-700" />
                  <div className="mb-6 h-8 w-72 animate-pulse rounded bg-slate-800" />
                  <div className="space-y-3">
                    <div className="h-20 animate-pulse rounded-xl bg-[#0A162B]" />
                    <div className="h-20 animate-pulse rounded-xl bg-[#0A162B]" />
                    <div className="h-56 animate-pulse rounded-2xl bg-[#0A162B]" />
                  </div>
                </div>
              }
            >
              {isLoadingStep ? (
                <div className="rounded-2xl border border-slate-800 bg-[#111F38] p-8">
                  <div className="mb-3 h-3 w-40 animate-pulse rounded bg-slate-700" />
                  <div className="mb-6 h-8 w-72 animate-pulse rounded bg-slate-800" />
                  <div className="space-y-3">
                    <div className="h-20 animate-pulse rounded-xl bg-[#0A162B]" />
                    <div className="h-20 animate-pulse rounded-xl bg-[#0A162B]" />
                    <div className="h-56 animate-pulse rounded-2xl bg-[#0A162B]" />
                  </div>
                </div>
              ) : (
                renderActiveStep()
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
