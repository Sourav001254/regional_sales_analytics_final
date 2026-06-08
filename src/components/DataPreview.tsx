import { Table as TableIcon } from 'lucide-react';
import { SalesRecord } from '../utils/dataGenerator';

function keyMatchesFloat(key: string) {
  return ['Unit_Price', 'Discount_%', 'COGS', 'Revenue', 'Profit', 'Profit_Margin_%'].includes(key);
}

export const DataPreview = ({ data }: { data: SalesRecord[] }) => {
  const totalRevenue = data.reduce((sum, d) => sum + (d.Revenue || 0), 0);
  const avgMargin = data.reduce((sum, d) => sum + (d['Profit_Margin_%'] || 0), 0) / (data.length || 1);
  const totalOrders = data.length;
  const dates = data.map(d => new Date(d.Date).getTime()).filter(t => !isNaN(t));
  const dateRange = dates.length > 0 
    ? `${new Date(Math.min(...dates)).getFullYear()} - ${new Date(Math.max(...dates)).getFullYear()}`
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111F38] border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-400">${(totalRevenue / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-[#111F38] border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Avg Margin</p>
          <p className="text-xl font-bold text-amber-400">{avgMargin.toFixed(1)}%</p>
        </div>
        <div className="bg-[#111F38] border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Total Orders</p>
          <p className="text-xl font-bold text-sky-400">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-[#111F38] border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Date Range</p>
          <p className="text-xl font-bold text-fuchsia-400">{dateRange}</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A162B] shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-[#0A162B]/80 sticky top-0">
          <TableIcon className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-200">Data Preview (First 20 Rows)</h3>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0D1B31] text-xs uppercase text-slate-500 font-semibold border-b border-slate-800 sticky top-0 z-10">
              <tr>
                {data.length > 0 && Object.keys(data[0]).map(key => (
                  <th key={key} className="px-4 py-3 tracking-wide">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
              {data.slice(0, 20).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  {Object.values(row).map((val, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      {typeof val === 'number' && keyMatchesFloat(Object.keys(row)[colIdx]) 
                        ? typeof val === 'number' && (val % 1 !== 0) ? val.toFixed(2) : val
                        : val?.toString() || 'NaN'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
