import { ReactNode } from 'react';

interface StepCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const StepCard = ({ title, description, children }: StepCardProps) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-3">{title}</h1>
      <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
        {description}
      </p>
    </div>
    {children && <div className="mt-8 space-y-8">{children}</div>}
  </div>
);
