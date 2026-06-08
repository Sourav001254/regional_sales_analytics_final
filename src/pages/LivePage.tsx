import { Database, LayoutDashboard, Network, Code2, BarChart3 } from 'lucide-react';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';

interface LivePageProps {
  streamlitCode: string;
  sqlCode: string;
  proAnalyticsCode: string;
  handleDownloadText: (content: string, name: string) => void;
  activeTab: 'live' | 'pro';
}

export const LivePage = ({ streamlitCode, sqlCode, proAnalyticsCode, handleDownloadText, activeTab }: LivePageProps) => {
  if (activeTab === 'live') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3 flex items-center gap-2">
            <Database className="w-8 h-8 text-cyan-400" />
            Live Data & Advanced SQL Layer
          </h1>
          <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
            Demonstrates real engineers' workflows: loading the core data into a SQLite database, extracting complex KPI logic through CTEs and Window Functions, and powering a live streaming simulation using Streamlit.
          </p>
        </div>

        <div className="bg-[#111F38] border border-cyan-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">advanced_sql.sql</h3>
            </div>
            <p className="text-xs text-cyan-400/70">
              15+ Complex Queries • CTEs • LAG/LEAD • DENSE_RANK
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadText(sqlCode, 'advanced_sql.sql')} 
            text="Download SQL Scripts" 
            className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20" 
          />
        </div>

        <div className="bg-[#111F38] border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">live_dashboard.py</h3>
            </div>
            <p className="text-xs text-blue-400/70">
              Streamlit Frontend • SQLite Backend • Real-time UI Ticking
            </p>
          </div>
          <DownloadButton 
            onClick={() => handleDownloadText(streamlitCode, 'live_dashboard.py')} 
            text="Download Streamlit App" 
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20" 
          />
        </div>
      </div>
    );
  }

  return (
    <StepCard 
      title="Pro Analytics Layer"
      description="The ultimate data science armory: Logistic Regression for Churn Prediction (with ROC-AUC), Apriori algorithm for Market Basket Analysis, Monte Carlo probability fan charts, and dynamic Plotly Sankey diagrams."
    >
      <div className="bg-[#111F38] border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">pro_analytics.py</h3>
          </div>
          <p className="text-xs text-emerald-400/70">
            Churn ML • Apriori Baskets • 10k Monte Carlo Sims • Sankey Flows
          </p>
        </div>
        <DownloadButton 
          onClick={() => handleDownloadText(proAnalyticsCode, 'pro_analytics.py')} 
          text="Download Pro Analytics Script" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20" 
        />
      </div>

      <CodeViewer code={proAnalyticsCode} language="python" />
    </StepCard>
  );
};
