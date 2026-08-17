import React from 'react';
import { Question, AnswerRecord } from '../../types';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  PlusCircle, 
  Compass, 
  Layers,
  Award
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface CopilotSidebarProps {
  currentQuestion: Question;
  currentAnswer?: AnswerRecord;
  evaluationResult?: any;
  onAddFollowUpNote: (questionText: string) => void;
  totalQuestionsCount: number;
  answeredCount: number;
}

export const CopilotSidebar: React.FC<CopilotSidebarProps> = ({
  currentQuestion,
  currentAnswer,
  evaluationResult,
  onAddFollowUpNote,
  totalQuestionsCount,
  answeredCount
}) => {
  // Topic coverage stats
  const progressPercent = Math.round((answeredCount / totalQuestionsCount) * 100);

  // Radar Data for live preview
  const radarData = [
    { 
      subject: 'Tech', 
      A: evaluationResult?.competencies?.technicalKnowledge || 3, 
      benchmark: 4 
    },
    { 
      subject: 'Problem', 
      A: evaluationResult?.competencies?.problemSolving || 3, 
      benchmark: 4 
    },
    { 
      subject: 'Comm', 
      A: evaluationResult?.competencies?.communication || 4, 
      benchmark: 4 
    },
    { 
      subject: 'Arch', 
      A: evaluationResult?.competencies?.architectureSkills || 3, 
      benchmark: 4 
    },
    { 
      subject: 'Code', 
      A: evaluationResult?.competencies?.codingSkills || 3, 
      benchmark: 4 
    },
  ];

  const feedback = currentAnswer?.copilotFeedback;

  return (
    <div className="space-y-4 text-xs">
      
      {/* Copilot Header */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot size={16} />
            </div>
            <div>
              <span className="font-heading font-bold text-slate-900 text-xs block">
                AI Copilot Active
              </span>
              <span className="text-[10px] text-blue-700 font-semibold">Real-time Telemetry</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200 shadow-2xs">
            {currentQuestion.competency}
          </span>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
            <span>Interview Completion</span>
            <span className="text-slate-900 font-bold">{answeredCount}/{totalQuestionsCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Real-time Copilot Analysis on Current Question */}
      {currentAnswer ? (
        <div className="space-y-3">
          
          {/* Strengths & Gaps Identified */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Sparkles size={13} className="text-blue-600" />
                Response Evaluation
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                currentAnswer.scoreAwarded >= 8 ? 'bg-emerald-100 text-emerald-800' :
                currentAnswer.scoreAwarded >= 5 ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                Score: {currentAnswer.scoreAwarded}/10
              </span>
            </div>

            {feedback?.strength && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" /> Demonstrated Strength:
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  {feedback.strength}
                </p>
              </div>
            )}

            {feedback?.weakness && !feedback.weakness.includes('None') && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <AlertTriangle size={11} className="text-amber-600" /> Knowledge Gap / Blindspot:
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  {feedback.weakness}
                </p>
              </div>
            )}
          </div>

          {/* Recommended Follow-up Questions */}
          {feedback?.followUpQuestions && feedback.followUpQuestions.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <HelpCircle size={13} className="text-blue-600" />
                  Recommended Follow-Ups ({feedback.followUpQuestions.length})
                </span>
                <span className="text-[10px] text-blue-700 font-bold">Probing Prompts</span>
              </div>

              <div className="space-y-2">
                {feedback.followUpQuestions.map((fq, idx) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-1.5"
                  >
                    <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                      "{fq}"
                    </p>
                    <button
                      onClick={() => onAddFollowUpNote(`Follow-up asked: ${fq}`)}
                      className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <PlusCircle size={11} />
                      <span>Insert into Interviewer Notes</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
          <HelpCircle size={24} className="mx-auto text-slate-400" />
          <p className="text-xs text-slate-500">
            Select an answer choice or candidate response to generate real-time Copilot strengths, gaps, and follow-up prompts.
          </p>
        </div>
      )}

      {/* Real-time Mini Radar Chart Preview */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <TrendingUp size={13} className="text-blue-600" />
            Live Competency Radar
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Score: <strong className="text-slate-900 font-bold">{evaluationResult?.totalScore || 0}%</strong>
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
              <Radar
                name="Candidate"
                dataKey="A"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.35}
              />
              <Radar
                name="Target Benchmark"
                dataKey="benchmark"
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.08}
                strokeDasharray="3 3"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
