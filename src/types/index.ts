export interface Candidate {
  id: string;
  name: string;
  role: 'GenAI Engineer' | 'AI Architect' | 'Data Engineer' | 'Full Stack Engineer' | 'DevOps Engineer';
  experienceYears: number;
  skills: string[];
  resumeSummary: string;
  interviewStage: 'Screening' | 'Scheduled' | 'Interview In Progress' | 'Feedback Pending' | 'Completed' | 'Offer Extended' | 'Rejected';
  assignedInterviewerId: string;
  assignedInterviewerName: string;
  hiringManagerId: string;
  email: string;
  location: string;
  education: string;
  targetSalary: string;
  avatarUrl: string;
  overallScore?: number;
  recommendation?: 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';
}

export interface Interviewer {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  rating: number;
  activeInterviewsCount: number;
  avatarUrl: string;
}

export interface HiringManager {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  openReqs: number;
  avatarUrl: string;
}

export interface PredefinedResponse {
  id: string;
  label: string;
  candidateTranscript: string;
  score: number; // 1 - 10
  strength: string;
  weakness: string;
  followUpQuestions: string[];
}

export interface Question {
  questionId: string;
  role: 'GenAI Engineer' | 'AI Architect' | 'Data Engineer' | 'Full Stack Engineer' | 'DevOps Engineer';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionType: 'MCQ' | 'Subjective' | 'Scenario';
  question: string;
  scenarioContext?: string;
  competency: 'Technical Knowledge' | 'Problem Solving' | 'Communication' | 'Architecture Skills' | 'Coding Skills';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  score: number; // Max points (e.g., 10)
  predefinedResponses?: PredefinedResponse[];
}

export interface AnswerRecord {
  questionId: string;
  questionType: 'MCQ' | 'Subjective' | 'Scenario';
  selectedOption?: string; // For MCQ
  isCorrect?: boolean;
  selectedResponseId?: string; // For Subjective
  customNotes?: string;
  scoreAwarded: number;
  competency: string;
  copilotFeedback?: {
    strength: string;
    weakness: string;
    followUpQuestions: string[];
  };
  timestamp: string;
}

export interface CompetencyScore {
  category: 'Technical Knowledge' | 'Problem Solving' | 'Communication' | 'Architecture Skills' | 'Coding Skills';
  score: number; // 1 to 5
  benchmark: number; // 1 to 5
  notes: string;
}

export interface InterviewRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  interviewerId: string;
  interviewerName: string;
  hiringManagerId: string;
  date: string;
  status: 'In Progress' | 'Completed' | 'Feedback Pending';
  mode: 'MCQ' | 'Subjective' | 'Hybrid';
  answers: AnswerRecord[];
  totalScore: number; // 0 - 100
  recommendation: 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';
  competencyScores: {
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    architectureSkills: number;
    codingSkills: number;
  };
  summary: {
    strengths: string[];
    weaknesses: string[];
    keyObservations: string[];
    areasForImprovement: string[];
    overallSummary: string;
  };
  workdaySynced: boolean;
  workdaySyncTimestamp?: string;
  slackNotified: boolean;
  slackNotificationTimestamp?: string;
}

export interface SlackMessage {
  id: string;
  channel: string;
  sender: {
    name: string;
    avatar: string;
    isBot: boolean;
  };
  timestamp: string;
  text: string;
  blocks?: {
    type: 'header' | 'section' | 'actions' | 'divider' | 'context';
    text?: string;
    fields?: string[];
    buttons?: {
      label: string;
      action: string;
      style?: 'primary' | 'danger' | 'default';
    }[];
  }[];
}

export interface WorkdayRecord {
  id: string;
  reqNumber: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  stage: string;
  submittedBy: string;
  submittedAt: string;
  scorecardStatus: 'Submitted' | 'Pending Review' | 'Draft';
  overallRating: string;
  recommendation: string;
  notes: string;
}
