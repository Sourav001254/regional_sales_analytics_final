import { FileText } from 'lucide-react';
import { StepCard } from '../components/StepCard';
import { DownloadButton } from '../components/DownloadButton';
import { DataPreview } from '../components/DataPreview';
import { SalesRecord, convertToCSV } from '../utils/dataGenerator';

interface DataGenPageProps {
  data: SalesRecord[];
}

export const DataGenPage = ({ data }: DataGenPageProps) => {
  const handleDownloadCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synthetic_sales_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <StepCard
      title="Synthetic Dataset Generation"
      description="As requested, I have generated a comprehensive 5000-row synthetic dataset that covers the exact schema specified for the Regional Sales DB. It contains realistic seasonal trends, varied margins, standard product hierarchies, robust identifiers, and real-world messiness (nulls, duplicates, currency formatting)."
    >
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-[#111F38] p-6 md:flex-row">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="font-semibold text-white">synthetic_sales_data.csv</h3>
          </div>
          <p className="text-xs text-slate-400">5000+ rows | 30 columns | 2021-2024 Date Range</p>
        </div>
        <DownloadButton
          onClick={handleDownloadCSV}
          text="Download CSV"
          className="bg-[#D4AF37] text-[#06101F] shadow-[#D4AF37]/10 hover:bg-[#F2CE57]"
        />
      </div>

      <DataPreview data={data} />
    </StepCard>
  );
};
