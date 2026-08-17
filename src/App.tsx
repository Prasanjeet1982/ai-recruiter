import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { DemoStepper } from './components/layout/DemoStepper';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { HiringManagerDashboard } from './components/hiringManager/HiringManagerDashboard';
import { InterviewExecutionScreen } from './components/interview/InterviewExecutionScreen';
import { ScorecardSummaryScreen } from './components/scorecard/ScorecardSummaryScreen';
import { WorkdayPortal } from './components/workday/WorkdayPortal';
import { SlackPortal } from './components/slack/SlackPortal';
import { QuestionBankExplorer } from './components/questions/QuestionBankExplorer';
import { ShieldCheck, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with Persona and Tab Switcher */}
      <Navbar />

      {/* Persistent 10-Step Guided Executive Tour Banner */}
      <DemoStepper />

      {/* Main Screen Router */}
      <main className="flex-1 w-full bg-radial-subtle">
        {activeView === 'recruiter' && <RecruiterDashboard />}
        {activeView === 'hiringManager' && <HiringManagerDashboard />}
        {activeView === 'interview' && <InterviewExecutionScreen />}
        {activeView === 'scorecard' && <ScorecardSummaryScreen />}
        {activeView === 'workday' && <WorkdayPortal />}
        {activeView === 'slack' && <SlackPortal />}
        {activeView === 'questions' && <QuestionBankExplorer />}
      </main>

      {/* Enterprise Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">InterviewIQ™ Platform</span>
            <span className="text-slate-400">&bull;</span>
            <span>AI-Powered Interview Management System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <ShieldCheck size={14} className="text-blue-600" />
              100% Local Rule-Based Architecture
            </span>
            <span>&bull;</span>
            <span>Zero External AI / Cloud API Dependencies</span>
            <span>&bull;</span>
            <span className="font-mono text-slate-600 font-semibold">v1.0-POC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
