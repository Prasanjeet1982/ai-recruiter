import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Award, 
  Bot, 
  Building2, 
  MessageSquare, 
  ArrowLeft, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  ListChecks, 
  Share2, 
  Download,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import confetti from 'canvas-confetti';
import { WorkdaySyncModal } from '../modals/WorkdaySyncModal';

export const ScorecardSummaryScreen: React.FC = () => {
  const { 
    activeInterview, 
    historicalInterviews, 
    syncInterviewToWorkday, 
    sendSlackNotification, 
    setActiveView,
    setDemoStep
  } = useApp();

  const [isSyncingWorkday, setIsSyncingWorkday] = useState<boolean>(false);
  const [showWorkdayModal, setShowWorkdayModal] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<boolean>(false);

  // Take current active interview or most recent historical interview
  const activeRecord = activeInterview?.evaluationResult 
    ? {
        candidateName: activeInterview.candidate.name,
        candidateRole: activeInterview.candidate.role,
        interviewerName: activeInterview.interviewer.name,
        totalScore: activeInterview.evaluationResult.totalScore,
        recommendation: activeInterview.evaluationResult.recommendation,
        recommendationRationale: activeInterview.evaluationResult.recommendationRationale,
        competencies: activeInterview.evaluationResult.competencies,
        strengths: activeInterview.evaluationResult.strengths,
        weaknesses: activeInterview.evaluationResult.weaknesses,
        keyObservations: activeInterview.evaluationResult.keyObservations,
        areasForImprovement: activeInterview.evaluationResult.areasForImprovement,
        overallSummary: activeInterview.evaluationResult.overallSummary,
        answersCount: activeInterview.answers.length,
        notes: activeInterview.interviewerNotes
      }
    : historicalInterviews[0] 
    ? {
        candidateName: historicalInterviews[0].candidateName,
        candidateRole: historicalInterviews[0].candidateRole,
        interviewerName: historicalInterviews[0].interviewerName,
        totalScore: historicalInterviews[0].totalScore,
        recommendation: historicalInterviews[0].recommendation,
        recommendationRationale: `Candidate demonstrated exceptional competency across core technical and architectural benchmarks for ${historicalInterviews[0].candidateRole}.`,
        competencies: historicalInterviews[0].competencyScores,
        strengths: historicalInterviews[0].summary.strengths,
        weaknesses: historicalInterviews[0].summary.weaknesses,
        keyObservations: historicalInterviews[0].summary.keyObservations,
        areasForImprovement: historicalInterviews[0].summary.areasForImprovement,
        overallSummary: historicalInterviews[0].summary.overallSummary,
        answersCount: 10,
        notes: "Candidate was composed and highly articulate."
      }
    : null;

  useEffect(() => {
    if (activeRecord && (activeRecord.recommendation === 'Strong Hire' || activeRecord.recommendation === 'Hire')) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [activeRecord?.recommendation]);

  if (!activeRecord) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">
        No evaluation scorecard available. Please conduct an interview first.
      </div>
    );
  }

  const radarData = [
    { subject: 'Technical Knowledge', Candidate: activeRecord.competencies.technicalKnowledge, Benchmark: 4 },
    { subject: 'Problem Solving', Candidate: activeRecord.competencies.problemSolving, Benchmark: 4 },
    { subject: 'Communication', Candidate: activeRecord.competencies.communication, Benchmark: 3.5 },
    { subject: 'Architecture Skills', Candidate: activeRecord.competencies.architectureSkills, Benchmark: 4 },
    { subject: 'Coding Skills', Candidate: activeRecord.competencies.codingSkills, Benchmark: 4 }
  ];

  const handleSyncToWorkday = async () => {
    setIsSyncingWorkday(true);
    await syncInterviewToWorkday();
    setIsSyncingWorkday(false);
    setShowWorkdayModal(true);
    setSyncSuccessToast(true);
    setDemoStep(8);
  };

  const handlePushToSlack = () => {
    sendSlackNotification('interview_completed', {
      candidateName: activeRecord.candidateName,
      role: activeRecord.candidateRole,
      score: activeRecord.totalScore,
      recommendation: activeRecord.recommendation
    });
    setActiveView('slack');
    setDemoStep(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      {syncSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-md animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div>
              <span className="font-bold text-sm block">
                ✓ Interview Feedback Submitted Successfully to Workday HCM
              </span>
              <span className="text-xs text-emerald-700">
                Scorecard and hiring recommendation have been posted to Job Requisition #REQ-2026-084.
              </span>
            </div>
          </div>
          <button 
            onClick={() => setActiveView('workday')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            View in Workday
          </button>
        </div>
      )}

      {/* Top Header Card with Recommendation Badge */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              FINAL EVALUATION REPORT
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {Date.now().toString().slice(-6)}</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            {activeRecord.candidateName} &mdash; <span className="text-blue-700">{activeRecord.candidateRole}</span>
          </h1>
          <p className="text-xs text-slate-500">
            Evaluated by <strong className="text-slate-800">{activeRecord.interviewerName}</strong> &bull; {activeRecord.answersCount} Structured Assessment Items
          </p>
        </div>

        {/* Big Recommendation Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Aggregate Score</span>
            <span className="text-3xl font-heading font-extrabold text-slate-900">{activeRecord.totalScore}<span className="text-lg text-slate-400">/100</span></span>
          </div>

          <div className={`px-5 py-3 rounded-2xl border shadow-sm flex items-center gap-2.5 ${
            activeRecord.recommendation === 'Strong Hire' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : activeRecord.recommendation === 'Hire'
              ? 'bg-blue-50 border-blue-300 text-blue-900'
              : activeRecord.recommendation === 'Borderline'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <Award size={24} className={
              activeRecord.recommendation === 'Strong Hire' ? 'text-emerald-600' :
              activeRecord.recommendation === 'Hire' ? 'text-blue-600' :
              activeRecord.recommendation === 'Borderline' ? 'text-amber-600' : 'text-rose-600'
            } />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">AI Recommendation</span>
              <span className="text-lg font-heading font-bold">{activeRecord.recommendation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Rule-based deterministic scoring verified &mdash; Zero third-party cloud AI dependencies.</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncToWorkday}
            disabled={isSyncingWorkday}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Building2 size={15} />
            <span>{isSyncingWorkday ? 'Syncing to Workday...' : 'Submit Feedback to Workday HCM'}</span>
          </button>

          <button
            onClick={handlePushToSlack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A154B] hover:bg-[#611f69] text-white font-bold text-xs shadow-sm transition-all"
          >
            <MessageSquare size={15} />
            <span>Notify Hiring Channel on Slack</span>
          </button>

          <button
            onClick={() => setActiveView('recruiter')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Radar Chart & Competency Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                5-Dimension Competency Radar
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Normalized 1-5
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Candidate performance mapped against enterprise benchmark</p>
          </div>

          <div className="h-72 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#475569" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <Radar
                  name="Candidate"
                  dataKey="Candidate"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Benchmark"
                  dataKey="Benchmark"
                  stroke="#059669"
                  fill="#10b981"
                  fillOpacity={0.08}
                  strokeDasharray="3 3"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600"></span>
              <span className="text-slate-800 font-semibold">Candidate Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-500 border-dashed"></span>
              <span className="text-slate-600 font-medium">Role Benchmark (4.0)</span>
            </div>
          </div>
        </div>

        {/* Detailed Competency Scores & Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <ListChecks size={16} className="text-blue-600" />
              Category Rating & Depth Breakdown
            </h2>
            <p className="text-xs text-slate-500">Individual rubric scores rated on standard 1-to-5 enterprise scale</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Technical Knowledge', score: activeRecord.competencies.technicalKnowledge, desc: 'Theoretical depth, architectural mastery, and language/runtime familiarity.' },
              { label: 'Problem Solving', score: activeRecord.competencies.problemSolving, desc: 'Structured analytical breakdown, handling trade-offs, and edge case resilience.' },
              { label: 'Communication', score: activeRecord.competencies.communication, desc: 'Clarity of thought, concise articulation, and proactive risk communication.' },
              { label: 'Architecture Skills', score: activeRecord.competencies.architectureSkills, desc: 'Enterprise system design, distributed scalability, and security posture.' },
              { label: 'Coding Skills', score: activeRecord.competencies.codingSkills, desc: 'Implementation efficiency, clean code practices, and syntax precision.' }
            ].map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">{comp.label}</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                          star <= comp.score 
                            ? 'bg-blue-600 text-white shadow-2xs' 
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {star}
                      </span>
                    ))}
                    <span className="ml-2 font-bold text-slate-900 text-xs">{comp.score}/5</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-Generated Summary & Observations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Strengths & Weaknesses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            Key Strengths & Identified Gaps
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                <CheckCircle2 size={14} className="text-emerald-600" /> Demonstrated Strengths:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 text-[11px] font-medium">
                {activeRecord.strengths.map((str, i) => (
                  <li key={i} className="leading-relaxed">{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-800 flex items-center gap-1.5 text-xs">
                <AlertTriangle size={14} className="text-amber-600" /> Areas for Improvement / Knowledge Gaps:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 text-[11px] font-medium">
                {activeRecord.weaknesses.map((w, i) => (
                  <li key={i} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Overall Summary & Key Observations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Bot size={16} className="text-blue-600" />
              Executive Assessment Summary
            </h3>
            <p className="text-xs text-slate-500 mt-1">Rule-generated synthesis based on full session evaluation</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-blue-700 text-xs">Overall Narrative:</span>
              <p className="text-slate-700 leading-relaxed text-[11px] font-medium">
                {activeRecord.overallSummary}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 text-xs">Hiring Rationale:</span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {activeRecord.recommendationRationale}
              </p>
            </div>

            {activeRecord.notes && (
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Interviewer Notes:</span>
                <p className="text-slate-700 font-mono text-[10px] whitespace-pre-line">
                  {activeRecord.notes}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <span className="text-[10px] text-slate-500">
              Evaluator Signature: <strong className="text-slate-800">{activeRecord.interviewerName}</strong> &bull; Validated by AI Copilot Engine
            </span>
          </div>
        </div>
      </div>

      {/* Workday Sync Modal */}
      {showWorkdayModal && (
        <WorkdaySyncModal
          candidateName={activeRecord.candidateName}
          role={activeRecord.candidateRole}
          score={activeRecord.totalScore}
          recommendation={activeRecord.recommendation}
          onClose={() => setShowWorkdayModal(false)}
        />
      )}
    </div>
  );
};
