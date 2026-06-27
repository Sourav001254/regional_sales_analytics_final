import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Code2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
  icon?: 'play' | 'code';
}

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markdown', markdown);

const resolveLanguage = (language: string) => {
  switch (language) {
    case 'dax':
      return 'sql';
    default:
      return language;
  }
};

export const CodeViewer = ({
  code,
  language = 'python',
  title = 'Script Preview',
  icon = 'play',
}: CodeViewerProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0A162B] shadow-sm">
    <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-800 bg-[#0A162B]/80 p-4">
      <div className="flex items-center gap-2">
        {icon === 'play' ? <Play className="h-4 w-4 text-emerald-500" /> : <Code2 className="h-4 w-4 text-fuchsia-500" />}
        <h3 className="text-sm font-medium text-slate-200">{title}</h3>
      </div>
      <div className="flex gap-1.5 opacity-50">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-amber-500" />
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
      </div>
    </div>
    <div className="overflow-x-auto bg-[#06101F] p-4 md:p-6">
      <SyntaxHighlighter
        language={resolveLanguage(language)}
        style={vscDarkPlus}
        customStyle={{ borderRadius: 8, fontSize: 13, background: 'transparent', margin: 0, padding: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  </div>
);
