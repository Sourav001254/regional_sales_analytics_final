import { Brain, Code2, Sparkles } from 'lucide-react';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';

interface MLPageProps {
  advancedFeaturesCode: string;
  aiMlLayerCode: string;
  handleDownloadPy: (code: string, filename: string) => void;
  activeTab: 'standard' | 'god-tier';
}

export const MLPage = ({ advancedFeaturesCode, aiMlLayerCode, handleDownloadPy, activeTab }: MLPageProps) => {
  if (activeTab === 'standard') {
    return (
      <StepCard 
        title="AI & Advanced Analytics"
        description="The final Python module leverages statsmodels for SARIMAX predictive forecasting, scikit-learn for K-Means customer segmentation clustering, and IsolationForest to strictly flag anomalous financial reporting days based on unit/profit matrices."
      >
        <div className="bg-[#111F38] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-fuchsia-400" />
              <h3 className="font-semibold text-white">advanced_features.py</h3>
            </div>
            <p className="text-xs text-slate-400">
              Scikit-Learn • Statsmodels • Anomaly Detection • NLP Insights
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadPy(advancedFeaturesCode, 'advanced_features.py')} 
            text="Download Advanced Script" 
            className="bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-fuchsia-500/10" 
          />
        </div>

        <CodeViewer code={advancedFeaturesCode} language="python" />
      </StepCard>
    );
  }

  return (
    <StepCard 
      title="God-Tier AI/ML Layer"
      description="Injects true intelligent agency into the reporting stack: a Natural Language Query (NLQ) engine via Gemini + LangChain, Automated SHAP explainability for XGBoost predictions, and an LLM-driven anomaly contextualizer."
    >
      <div className="bg-[#111F38] border border-fuchsia-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(217,70,239,0.1)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <h3 className="font-semibold text-white">ai_ml_layer.py</h3>
          </div>
          <p className="text-xs text-fuchsia-400/70">
            Gemini 1.5 • Langchain Agents • XGBoost + SHAP Waterfall
          </p>
        </div>
        <DownloadButton 
          onClick={() => handleDownloadPy(aiMlLayerCode, 'ai_ml_layer.py')} 
          text="Download AI/ML Layer" 
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-fuchsia-500/20" 
        />
      </div>

      <CodeViewer code={aiMlLayerCode} language="python" />
    </StepCard>
  );
};
