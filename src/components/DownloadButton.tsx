import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
}

export const DownloadButton = ({ onClick, text, className = '' }: DownloadButtonProps) => (
  <button 
    onClick={onClick}
    className={`hover:scale-105 active:scale-95 transition-all w-full md:w-auto px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg ${className}`}
  >
    <Download className="w-4 h-4" />
    {text}
  </button>
);
