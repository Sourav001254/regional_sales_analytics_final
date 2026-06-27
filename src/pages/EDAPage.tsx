import { useMemo, useState } from 'react';
import { BarChart3, ScatterChart, PieChart, Code2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { CodeViewer } from '../components/CodeViewer';
import { SalesRecord } from '../utils/dataGenerator';

interface EDAPageProps {
  codeStr: string;
  handleDownloadPy: () => void;
  data: SalesRecord[];
}

export const EDAPage = ({ codeStr, handleDownloadPy, data }: EDAPageProps) => {
  const [metric, setMetric] = useState<'Revenue' | 'Profit'>('Revenue');

  const regionData = useMemo(() => {
    return ['North', 'South', 'East', 'West', 'Central'].map((r) => ({
      region: r,
      Revenue: data.filter((d) => d.Region === r).reduce((s, d) => s + (d.Revenue || 0), 0),
      Profit: data.filter((d) => d.Region === r).reduce((s, d) => s + (d.Profit || 0), 0),
    }));
  }, [data]);

  return (
    <StepCard
      title="EDA & Modeling"
      description="The exploratory data analysis script uses Matplotlib, Seaborn, and Folium to generate a vast array of high-res PNG plots. It covers univariate, bivariate, multivariate, and time-series analyses. It also automates complex visuals like Pareto charts, Waterfall charts, RFM customer segmentation, and Cohort retention heatmaps."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#111F38] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/20">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
          </div>
          <h4 className="text-sm font-semibold text-white">Univariate & Bivariate</h4>
          <p className="text-xs text-slate-400">Histograms, Count plots, Correlation Heatmaps, and Margin Boxplots.</p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#111F38] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/20">
            <ScatterChart className="h-5 w-5 text-emerald-400" />
          </div>
          <h4 className="text-sm font-semibold text-white">Multivariate & Time-Series</h4>
          <p className="text-xs text-slate-400">Seasonal Decompositions, YoY Bar charts, and Bubble scatter plots.</p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#111F38] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/20">
            <PieChart className="h-5 w-5 text-rose-400" />
          </div>
          <h4 className="text-sm font-semibold text-white">Advanced & Geographic</h4>
          <p className="text-xs text-slate-400">RFM Analysis, Cohort Retention, Pareto charts, and Folium Maps.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#111F38] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-white">Live Data Explorer</h3>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as 'Revenue' | 'Profit')}
            className="rounded-lg border border-slate-700 bg-[#0A162B] px-3 py-1.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="Revenue">Total Revenue by Region</option>
            <option value="Profit">Total Profit by Region</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="region"
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8 }}
                itemStyle={{ color: '#818cf8' }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, metric]}
              />
              <Bar dataKey={metric} fill={metric === 'Revenue' ? '#818cf8' : '#34d399'} radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-[#111F38] p-6 md:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Code2 className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold text-white">eda_analysis.py</h3>
          </div>
          <p className="text-xs text-slate-400">Seaborn | Matplotlib | Folium | Statsmodels</p>
        </div>
        <DownloadButton
          onClick={handleDownloadPy}
          text="Download EDA Script"
          className="bg-indigo-500 text-white shadow-indigo-500/10 hover:bg-indigo-400"
        />
      </div>

      <CodeViewer code={codeStr} language="python" />
    </StepCard>
  );
};
