import { CheckCircle2, Lock } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  status: string;
  desc: string;
}

interface SidebarProps {
  steps: Step[];
  activeStepId: number;
  setActiveStepId: (id: number) => void;
}

const getStepStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-slate-800/50 border border-slate-700 shadow-inner';
    case 'completed': return 'border border-transparent hover:bg-slate-800/40 cursor-pointer';
    default: return 'bg-transparent opacity-60 hover:bg-slate-800/20 cursor-not-allowed';
  }
};

const getIconStatus = (status: string, id: number) => {
  if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'active') return <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#06101F] text-xs font-bold">{id}</div>;
  return <Lock className="w-4 h-4 text-slate-500" />;
};

export const Sidebar = ({ steps, activeStepId, setActiveStepId }: SidebarProps) => {
  return (
    <aside className="w-80 border-r border-slate-800 bg-[#0A162B] flex flex-col hidden lg:flex">
      <div className="p-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-white mb-1">
          Data Project Hub
        </h1>
        <p className="text-xs text-slate-400">Regional Sales Analytics</p>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {steps.map((step) => {
          const isActive = step.id === activeStepId;
          const currentStatus = isActive ? 'active' : step.status;
          return (
            <button 
              key={step.id} 
              disabled={step.status === 'locked' && !isActive}
              onClick={() => (step.status !== 'locked' || isActive) && setActiveStepId(step.id)}
              className={`w-full text-left p-3.5 rounded-xl flex items-start gap-4 transition-all duration-200 ${getStepStatusClass(currentStatus)}`}
            >
              <div className="mt-0.5 shrink-0 w-6 flex justify-center">
                {getIconStatus(currentStatus, step.id)}
              </div>
              <div>
                <h3 className={`font-medium text-sm ${currentStatus === 'active' || currentStatus === 'completed' ? 'text-white' : 'text-slate-400'}`}>
                  Step {step.id}: {step.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{step.desc}</p>
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Environment Ready</span>
        </div>
      </div>
    </aside>
  );
};
