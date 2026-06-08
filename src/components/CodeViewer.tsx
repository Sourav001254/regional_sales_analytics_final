import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Code2 } from 'lucide-react';

export const CodeViewer = ({ code, language = 'python', title = 'Script Preview', icon = 'play' }: { code: string; language?: string; title?: string; icon?: 'play' | 'code' }) => (
  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0A162B] shadow-sm">
    <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 bg-[#0A162B]/80 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {icon === 'play' ? <Play className="w-4 h-4 text-emerald-500" /> : <Code2 className="w-4 h-4 text-fuchsia-500" />}
        <h3 className="text-sm font-medium text-slate-200">{title}</h3>
      </div>
      <div className="flex gap-1.5 opacity-50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
      </div>
    </div>
    <div className="overflow-x-auto p-4 md:p-6 bg-[#06101F]">
      <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus}
        customStyle={{ borderRadius: 8, fontSize: 13, background: 'transparent', margin: 0, padding: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  </div>
);
