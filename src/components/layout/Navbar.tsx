import React from 'react';
import { useApp, AppView, UserPersona } from '../../context/AppContext';
import { 
  Sparkles, 
  Users, 
  Briefcase, 
  Bot, 
  BookOpen, 
  Building2, 
  MessageSquare, 
  RotateCcw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    activePersona, 
    setActivePersona,
    activeInterview,
    workdayRecords,
    slackMessages,
    resetDemoData
  } = useApp();

  const navItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'recruiter', label: 'Recruiter Dashboard', icon: <Users size={15} /> },
    { id: 'hiringManager', label: 'Hiring Manager', icon: <Briefcase size={15} /> },
    { 
      id: 'interview', 
      label: 'Live AI Copilot', 
      icon: <Bot size={15} />,
      badge: activeInterview ? 'Active' : undefined
    },
    { 
      id: 'scorecard', 
      label: 'Scorecard & Summary', 
      icon: <CheckCircle2 size={15} /> 
    },
    { id: 'questions', label: 'Question Bank', icon: <BookOpen size={15} />, badge: '100+' },
    { 
      id: 'workday', 
      label: 'Workday HCM', 
      icon: <Building2 size={15} />,
      badge: workdayRecords.length 
    },
    { 
      id: 'slack', 
      label: 'Slack Connect', 
      icon: <MessageSquare size={15} />,
      badge: slackMessages.length 
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('recruiter')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[2px] shadow-md shadow-blue-500/20">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="text-blue-600 h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
                  Interview<span className="text-blue-600">IQ</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AI Enterprise POC
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Intelligent Interview & Hiring Management</p>
            </div>
          </div>

          {/* Persona Switcher */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 px-2.5 flex items-center gap-1">
              <ShieldCheck size={14} className="text-blue-600" /> Persona:
            </span>
            {(['Recruiter', 'Interviewer', 'Hiring Manager'] as UserPersona[]).map(persona => (
              <button
                key={persona}
                onClick={() => {
                  setActivePersona(persona);
                  if (persona === 'Recruiter') setActiveView('recruiter');
                  if (persona === 'Hiring Manager') setActiveView('hiringManager');
                  if (persona === 'Interviewer') setActiveView('interview');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activePersona === persona
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {persona}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetDemoData}
              title="Reset all demo data and state back to fresh defaults"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all shadow-2xs"
            >
              <RotateCcw size={13} className="text-slate-500" />
              <span>Reset Demo</span>
            </button>

            {activeInterview && (
              <div 
                onClick={() => setActiveView('interview')}
                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold shadow-xs hover:bg-emerald-100 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>Session: {activeInterview.candidate.name.split(' ')[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : item.badge === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
