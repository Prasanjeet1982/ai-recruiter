import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Candidate,
  Interviewer,
  HiringManager,
  Question,
  InterviewRecord,
  AnswerRecord,
  SlackMessage,
  WorkdayRecord
} from '../types';

import rawCandidates from '../data/candidates.json';
import rawInterviewers from '../data/interviewers.json';
import rawHiringManagers from '../data/hiringManagers.json';
import rawQuestions from '../data/questions.json';
import rawHistoricalInterviews from '../data/historicalInterviews.json';
import rawWorkdayRecords from '../data/mockWorkdayRecords.json';
import rawSlackMessages from '../data/mockSlackMessages.json';
import { evaluateInterview, EvaluationResult } from '../utils/scoringEngine';

export type AppView = 
  | 'recruiter' 
  | 'hiringManager' 
  | 'interview' 
  | 'scorecard' 
  | 'workday' 
  | 'slack' 
  | 'questions';

export type UserPersona = 'Recruiter' | 'Interviewer' | 'Hiring Manager';

export interface ActiveInterviewState {
  candidate: Candidate;
  interviewer: Interviewer;
  questionSet: Question[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  mode: 'MCQ' | 'Subjective' | 'Hybrid';
  interviewerNotes: string;
  isCompleted: boolean;
  evaluationResult?: EvaluationResult;
}

interface AppContextType {
  // Navigation & Personas
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  activePersona: UserPersona;
  setActivePersona: (persona: UserPersona) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;

  // Data Stores
  candidates: Candidate[];
  interviewers: Interviewer[];
  hiringManagers: HiringManager[];
  questions: Question[];
  historicalInterviews: InterviewRecord[];
  workdayRecords: WorkdayRecord[];
  slackMessages: SlackMessage[];

  // Active Interview Session
  activeInterview: ActiveInterviewState | null;
  startInterview: (candidateId: string, interviewerId?: string, mode?: 'MCQ' | 'Subjective' | 'Hybrid') => void;
  recordAnswer: (answer: AnswerRecord) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  completeInterview: () => void;
  updateInterviewerNotes: (notes: string) => void;

  // Integrations & Actions
  syncInterviewToWorkday: (interviewRecordId?: string) => Promise<boolean>;
  sendSlackNotification: (type: 'interview_completed' | 'reminder' | 'scheduled' | 'offer_approval', data?: any) => void;
  scheduleInterview: (candidateId: string, interviewerId: string, date: string, time: string) => void;
  updateCandidateStage: (candidateId: string, stage: Candidate['interviewStage']) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CANDIDATES: 'ai_interview_candidates_v1',
  HISTORICAL: 'ai_interview_historical_v1',
  WORKDAY: 'ai_interview_workday_v1',
  SLACK: 'ai_interview_slack_v1',
  ACTIVE_INTERVIEW: 'ai_interview_active_session_v1',
  DEMO_STEP: 'ai_interview_demo_step_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<AppView>('recruiter');
  const [activePersona, setActivePersona] = useState<UserPersona>('Recruiter');
  const [demoStep, setDemoStepState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEMO_STEP);
    return saved ? parseInt(saved, 10) : 1;
  });

  // Persistent Collections
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    return saved ? JSON.parse(saved) : (rawCandidates as Candidate[]);
  });

  const [interviewers] = useState<Interviewer[]>(rawInterviewers as Interviewer[]);
  const [hiringManagers] = useState<HiringManager[]>(rawHiringManagers as HiringManager[]);
  const [questions] = useState<Question[]>(rawQuestions as Question[]);

  const [historicalInterviews, setHistoricalInterviews] = useState<InterviewRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORICAL);
    return saved ? JSON.parse(saved) : (rawHistoricalInterviews as unknown as InterviewRecord[]);
  });

  const [workdayRecords, setWorkdayRecords] = useState<WorkdayRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKDAY);
    return saved ? JSON.parse(saved) : (rawWorkdayRecords as WorkdayRecord[]);
  });

  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLACK);
    return saved ? JSON.parse(saved) : (rawSlackMessages as SlackMessage[]);
  });

  // Active Interview Session State
  const [activeInterview, setActiveInterview] = useState<ActiveInterviewState | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_INTERVIEW);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORICAL, JSON.stringify(historicalInterviews));
  }, [historicalInterviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKDAY, JSON.stringify(workdayRecords));
  }, [workdayRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLACK, JSON.stringify(slackMessages));
  }, [slackMessages]);

  useEffect(() => {
    if (activeInterview) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_INTERVIEW, JSON.stringify(activeInterview));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_INTERVIEW);
    }
  }, [activeInterview]);

  const setDemoStep = (step: number) => {
    setDemoStepState(step);
    localStorage.setItem(STORAGE_KEYS.DEMO_STEP, step.toString());
  };

  const nextDemoStep = () => {
    setDemoStepState(prev => {
      const next = Math.min(10, prev + 1);
      localStorage.setItem(STORAGE_KEYS.DEMO_STEP, next.toString());
      return next;
    });
  };

  const prevDemoStep = () => {
    setDemoStepState(prev => {
      const next = Math.max(1, prev - 1);
      localStorage.setItem(STORAGE_KEYS.DEMO_STEP, next.toString());
      return next;
    });
  };

  // Start Interview with a Candidate
  const startInterview = (
    candidateId: string,
    interviewerId?: string,
    mode: 'MCQ' | 'Subjective' | 'Hybrid' = 'Hybrid'
  ) => {
    const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
    const interviewer = interviewers.find(i => i.id === (interviewerId || candidate.assignedInterviewerId)) || interviewers[0];

    // Load top 10 relevant questions for this candidate's role
    const roleQuestions = questions.filter(q => q.role === candidate.role);
    // Take a balanced selection: 4 MCQ, 4 Subjective, 2 Scenario
    const mcqs = roleQuestions.filter(q => q.questionType === 'MCQ').slice(0, 4);
    const subjs = roleQuestions.filter(q => q.questionType === 'Subjective').slice(0, 4);
    const scenarios = roleQuestions.filter(q => q.questionType === 'Scenario').slice(0, 2);

    let selectedQuestions = [...mcqs, ...subjs, ...scenarios];
    if (selectedQuestions.length < 10) {
      selectedQuestions = roleQuestions.slice(0, 10);
    }

    const session: ActiveInterviewState = {
      candidate,
      interviewer,
      questionSet: selectedQuestions,
      currentQuestionIndex: 0,
      answers: [],
      mode,
      interviewerNotes: '',
      isCompleted: false
    };

    setActiveInterview(session);
    setActivePersona('Interviewer');
    setActiveView('interview');
    setDemoStep(2); // Step 2: Start Interview
  };

  // Record an answer for the current active question
  const recordAnswer = (answer: AnswerRecord) => {
    if (!activeInterview) return;

    setActiveInterview(prev => {
      if (!prev) return null;
      // Replace if answer for this questionId already exists, else append
      const filtered = prev.answers.filter(a => a.questionId !== answer.questionId);
      const updatedAnswers = [...filtered, answer];

      // Re-evaluate in real-time
      const evalRes = evaluateInterview(
        prev.candidate.role,
        prev.candidate.name,
        updatedAnswers,
        prev.questionSet,
        prev.interviewerNotes
      );

      return {
        ...prev,
        answers: updatedAnswers,
        evaluationResult: evalRes
      };
    });
  };

  const nextQuestion = () => {
    if (!activeInterview) return;
    if (activeInterview.currentQuestionIndex < activeInterview.questionSet.length - 1) {
      setActiveInterview(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 } : null);
    }
  };

  const prevQuestion = () => {
    if (!activeInterview) return;
    if (activeInterview.currentQuestionIndex > 0) {
      setActiveInterview(prev => prev ? { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 } : null);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (!activeInterview) return;
    if (index >= 0 && index < activeInterview.questionSet.length) {
      setActiveInterview(prev => prev ? { ...prev, currentQuestionIndex: index } : null);
    }
  };

  const updateInterviewerNotes = (notes: string) => {
    if (!activeInterview) return;
    setActiveInterview(prev => prev ? { ...prev, interviewerNotes: notes } : null);
  };

  // Complete Interview
  const completeInterview = () => {
    if (!activeInterview) return;

    const evaluation = evaluateInterview(
      activeInterview.candidate.role,
      activeInterview.candidate.name,
      activeInterview.answers,
      activeInterview.questionSet,
      activeInterview.interviewerNotes
    );

    const interviewId = `INT-REC-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    const newRecord: InterviewRecord = {
      id: interviewId,
      candidateId: activeInterview.candidate.id,
      candidateName: activeInterview.candidate.name,
      candidateRole: activeInterview.candidate.role,
      interviewerId: activeInterview.interviewer.id,
      interviewerName: activeInterview.interviewer.name,
      hiringManagerId: activeInterview.candidate.hiringManagerId,
      date: today,
      status: 'Completed',
      mode: activeInterview.mode,
      answers: activeInterview.answers,
      totalScore: evaluation.totalScore,
      recommendation: evaluation.recommendation,
      competencyScores: evaluation.competencies,
      summary: {
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        keyObservations: evaluation.keyObservations,
        areasForImprovement: evaluation.areasForImprovement,
        overallSummary: evaluation.overallSummary
      },
      workdaySynced: false,
      slackNotified: false
    };

    // Update historical interviews list
    setHistoricalInterviews(prev => [newRecord, ...prev]);

    // Update candidate record
    setCandidates(prev => prev.map(c => {
      if (c.id === activeInterview.candidate.id) {
        return {
          ...c,
          interviewStage: 'Completed',
          overallScore: evaluation.totalScore,
          recommendation: evaluation.recommendation
        };
      }
      return c;
    }));

    setActiveInterview(prev => prev ? {
      ...prev,
      isCompleted: true,
      evaluationResult: evaluation
    } : null);

    setActiveView('scorecard');
    setDemoStep(6); // Step 6: Complete Scorecard & View Summary
  };

  // Sync with Mock Workday
  const syncInterviewToWorkday = async (interviewRecordId?: string): Promise<boolean> => {
    const record = interviewRecordId 
      ? historicalInterviews.find(r => r.id === interviewRecordId)
      : historicalInterviews[0];

    if (!record) return false;

    // Simulate short network delay for enterprise realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const newWdRecord: WorkdayRecord = {
      id: `WD-${Date.now().toString().slice(-4)}`,
      reqNumber: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      jobTitle: record.candidateRole,
      candidateId: record.candidateId,
      candidateName: record.candidateName,
      stage: 'Interview Completed - Ready for Offer',
      submittedBy: record.interviewerName,
      submittedAt: new Date().toISOString(),
      scorecardStatus: 'Submitted',
      overallRating: `${record.recommendation} (${record.totalScore}/100)`,
      recommendation: record.recommendation,
      notes: record.summary.overallSummary
    };

    setWorkdayRecords(prev => [newWdRecord, ...prev]);

    // Mark historical interview as synced
    setHistoricalInterviews(prev => prev.map(r => {
      if (r.id === record.id) {
        return {
          ...r,
          workdaySynced: true,
          workdaySyncTimestamp: new Date().toISOString()
        };
      }
      return r;
    }));

    return true;
  };

  // Send Mock Slack Notification
  const sendSlackNotification = (
    type: 'interview_completed' | 'reminder' | 'scheduled' | 'offer_approval',
    data?: any
  ) => {
    let newMsg: SlackMessage;
    const nowStr = 'Just now';

    if (type === 'interview_completed') {
      const candidateName = data?.candidateName || activeInterview?.candidate.name || 'Dr. Elena Rostova';
      const role = data?.role || activeInterview?.candidate.role || 'GenAI Engineer';
      const score = data?.score || activeInterview?.evaluationResult?.totalScore || 94;
      const rec = data?.recommendation || activeInterview?.evaluationResult?.recommendation || 'Strong Hire';

      newMsg = {
        id: `SLK-${Date.now()}`,
        channel: 'interview-updates',
        sender: {
          name: 'AI Interview Copilot Bot',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          isBot: true
        },
        timestamp: nowStr,
        text: `⚡ Interview Feedback Submitted for ${candidateName}`,
        blocks: [
          {
            type: 'header',
            text: `🎯 Interview Scorecard Finalized: ${candidateName}`
          },
          {
            type: 'section',
            fields: [
              `*Role:* ${role}`,
              `*Score:* ${score}/100`,
              `*Recommendation:* ${rec === 'Strong Hire' ? '🟢 Strong Hire' : rec === 'Hire' ? '🔵 Hire' : rec === 'Borderline' ? '🟡 Borderline' : '🔴 No Hire'}`,
              `*Evaluator:* ${activeInterview?.interviewer.name || 'Sarah Jenkins'}`,
              `*Status:* Synced to Workday HCM`,
              `*Date:* ${new Date().toLocaleDateString()}`
            ]
          },
          {
            type: 'context',
            text: `📝 Summary: ${activeInterview?.evaluationResult?.overallSummary || 'Candidate demonstrated top-tier technical depth and architectural reasoning.'}`
          },
          {
            type: 'actions',
            buttons: [
              { label: 'View Radar Scorecard', action: 'view_scorecard', style: 'primary' },
              { label: 'Approve in Workday', action: 'approve_workday', style: 'default' }
            ]
          }
        ]
      };
    } else if (type === 'reminder') {
      newMsg = {
        id: `SLK-${Date.now()}`,
        channel: 'interview-updates',
        sender: {
          name: 'Recruiter Bot',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          isBot: true
        },
        timestamp: nowStr,
        text: '⏰ Feedback Pending Reminder sent to Interviewer.',
        blocks: [
          {
            type: 'header',
            text: '⏰ Feedback Reminder Dispatched'
          },
          {
            type: 'section',
            fields: [
              `*Candidate:* ${data?.candidateName || 'Carlos Delgado'}`,
              `*Interviewer:* ${data?.interviewerName || 'Kavita Nair'}`,
              `*Urgency:* High (SLA: 4 hours remaining)`
            ]
          }
        ]
      };
    } else {
      newMsg = {
        id: `SLK-${Date.now()}`,
        channel: 'hiring-pipeline',
        sender: {
          name: 'Interview Copilot Bot',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          isBot: true
        },
        timestamp: nowStr,
        text: '📌 Status Update: Candidate moved to Offer Approval pipeline.',
        blocks: [
          {
            type: 'section',
            text: `Candidate *${data?.candidateName || 'Dr. Elena Rostova'}* was approved for offer package generation by Hiring Manager.`
          }
        ]
      };
    }

    setSlackMessages(prev => [newMsg, ...prev]);
  };

  // Schedule an Interview
  const scheduleInterview = (candidateId: string, interviewerId: string, date: string, time: string) => {
    const interviewer = interviewers.find(i => i.id === interviewerId);
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          interviewStage: 'Scheduled',
          assignedInterviewerId: interviewerId,
          assignedInterviewerName: interviewer ? interviewer.name : c.assignedInterviewerName
        };
      }
      return c;
    }));

    sendSlackNotification('scheduled', {
      candidateName: candidates.find(c => c.id === candidateId)?.name,
      interviewerName: interviewer?.name,
      date,
      time
    });
  };

  const updateCandidateStage = (candidateId: string, stage: Candidate['interviewStage']) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { ...c, interviewStage: stage };
      }
      return c;
    }));
  };

  // Reset Demo State
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
    localStorage.removeItem(STORAGE_KEYS.HISTORICAL);
    localStorage.removeItem(STORAGE_KEYS.WORKDAY);
    localStorage.removeItem(STORAGE_KEYS.SLACK);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_INTERVIEW);
    localStorage.removeItem(STORAGE_KEYS.DEMO_STEP);

    setCandidates(rawCandidates as Candidate[]);
    setHistoricalInterviews(rawHistoricalInterviews as unknown as InterviewRecord[]);
    setWorkdayRecords(rawWorkdayRecords as WorkdayRecord[]);
    setSlackMessages(rawSlackMessages as SlackMessage[]);
    setActiveInterview(null);
    setDemoStepState(1);
    setActiveView('recruiter');
    setActivePersona('Recruiter');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activePersona,
        setActivePersona,
        demoStep,
        setDemoStep,
        nextDemoStep,
        prevDemoStep,
        candidates,
        interviewers,
        hiringManagers,
        questions,
        historicalInterviews,
        workdayRecords,
        slackMessages,
        activeInterview,
        startInterview,
        recordAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        completeInterview,
        updateInterviewerNotes,
        syncInterviewToWorkday,
        sendSlackNotification,
        scheduleInterview,
        updateCandidateStage,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
