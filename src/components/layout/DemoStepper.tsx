import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Play, 
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

export const DemoStepper: React.FC = () => {
  const { 
    demoStep, 
    setDemoStep, 
    nextDemoStep, 
    prevDemoStep,
    setActiveView,
    activeInterview,
    candidates,
    startInterview,
    completeInterview,
    syncInterviewToWorkday,
    sendSlackNotification
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const steps = [
    {
      num: 1,
      title: "1. Select Candidate",
      actionDesc: "Choose a candidate from the Recruiter Pipeline",
      targetView: "recruiter",
      handler: () => setActiveView('recruiter')
    },
    {
      num: 2,
      title: "2. Start Interview",
      actionDesc: "Launch live interview session with Dr. Elena Rostova",
      targetView: "interview",
      handler: () => {
        if (!activeInterview) {
          startInterview(candidates[0].id);
        } else {
          setActiveView('interview');
        }
      }
    },
    {
      num: 3,
      title: "3. Answer Questions",
      actionDesc: "Answer MCQ & Subjective questions with simulated candidate answers",
      targetView: "interview",
      handler: () => {
        if (!activeInterview) startInterview(candidates[0].id);
        setActiveView('interview');
      }
    },
    {
      num: 4,
      title: "4. View Scores",
      actionDesc: "Inspect real-time score updates and competency tracking in sidebar",
      targetView: "interview",
      handler: () => setActiveView('interview')
    },
    {
      num: 5,
      title: "5. Follow-ups",
      actionDesc: "Review intelligent follow-up suggestions recommended by Copilot",
      targetView: "interview",
      handler: () => setActiveView('interview')
    },
    {
      num: 6,
      title: "6. Scorecard",
      actionDesc: "Complete interview to view 5-dimension radar competency chart",
      targetView: "scorecard",
      handler: () => {
        if (activeInterview && !activeInterview.isCompleted) {
          completeInterview();
        } else {
          setActiveView('scorecard');
        }
      }
    },
    {
      num: 7,
      title: "7. AI Summary",
      actionDesc: "Review auto-generated executive summary and hiring recommendation",
      targetView: "scorecard",
      handler: () => setActiveView('scorecard')
    },
    {
      num: 8,
      title: "8. Submit Workday",
      actionDesc: "Sync feedback scorecard directly into mock Workday HCM portal",
      targetView: "workday",
      handler: async () => {
        await syncInterviewToWorkday();
        setActiveView('workday');
      }
    },
    {
      num: 9,
      title: "9. Slack Alert",
      actionDesc: "Verify automated rich BlockKit notification posted in Slack",
      targetView: "slack",
      handler: () => {
        sendSlackNotification('interview_completed');
        setActiveView('slack');
      }
    },
    {
      num: 10,
      title: "10. Analytics",
      actionDesc: "Return to Recruiter Dashboard to review pipeline metrics and charts",
      targetView: "recruiter",
      handler: () => setActiveView('recruiter')
    }
  ];

  const currentStepObj = steps.find(s => s.num === demoStep) || steps[0];

  const handleStepClick = (stepNum: number) => {
    setDemoStep(stepNum);
    const step = steps.find(s => s.num === stepNum);
    if (step) step.handler();
  };

  return (
    <aside aria-label="Executive Demo Flow Guide" className="border-b border-blue-100 bg-blue-50/70 text-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Guide Header */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-xs">
              <Sparkles size={13} className="text-cyan-200" />
              <span>EXECUTIVE DEMO FLOW</span>
            </div>
            <span className="text-xs text-slate-700 hidden md:inline font-medium">
              Step {demoStep} of 10: <strong className="text-blue-900 font-bold">{currentStepObj.title.split('. ')[1]}</strong> &mdash; <span className="text-slate-600">{currentStepObj.actionDesc}</span>
            </span>
          </div>

          {/* Quick Actions / Step controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                prevDemoStep();
                const prev = steps.find(s => s.num === Math.max(1, demoStep - 1));
                if (prev) prev.handler();
              }}
              disabled={demoStep === 1}
              className={`p-1 rounded-md border text-xs flex items-center gap-1 px-2 font-medium ${
                demoStep === 1 
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-100' 
                  : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={() => {
                nextDemoStep();
                const next = steps.find(s => s.num === Math.min(10, demoStep + 1));
                if (next) next.handler();
              }}
              disabled={demoStep === 10}
              className={`p-1 rounded-md border text-xs flex items-center gap-1 px-2.5 ${
                demoStep === 10 
                  ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-100' 
                  : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 font-bold'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight size={14} />
            </button>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-500 hover:text-slate-800 p-1"
              title={isExpanded ? "Collapse Demo Steps Bar" : "Expand Demo Steps Bar"}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* 10 Step Buttons */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-blue-100 grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {steps.map((step) => {
              const isCurrent = step.num === demoStep;
              const isPast = step.num < demoStep;

              return (
                <button
                  key={step.num}
                  onClick={() => handleStepClick(step.num)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 border border-blue-700 scale-[1.02]'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isPast ? (
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.num}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] truncate tracking-tight font-medium">
                    {step.title.split('. ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
