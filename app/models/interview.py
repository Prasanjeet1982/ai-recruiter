from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from .candidate import Candidate, Interviewer
from .question import Question

class CopilotFeedback(BaseModel):
    strength: str
    weakness: str
    followUpQuestions: List[str]

class AnswerRecord(BaseModel):
    questionId: str
    questionType: str
    selectedOption: Optional[str] = None
    isCorrect: Optional[bool] = None
    selectedResponseId: Optional[str] = None
    scoreAwarded: int
    competency: str
    copilotFeedback: Optional[CopilotFeedback] = None
    timestamp: str

class CompetencyScores(BaseModel):
    technicalKnowledge: int
    problemSolving: int
    communication: int
    architectureSkills: int
    codingSkills: int

class InterviewSummary(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    keyObservations: List[str]
    areasForImprovement: List[str]
    overallSummary: str

class EvaluationResult(BaseModel):
    totalScore: int
    recommendation: str  # Strong Hire, Hire, Borderline, No Hire
    recommendationRationale: str
    competencies: CompetencyScores
    strengths: List[str]
    weaknesses: List[str]
    keyObservations: List[str]
    areasForImprovement: List[str]
    overallSummary: str

class ActiveInterviewSession(BaseModel):
    candidate: Candidate
    interviewer: Interviewer
    questionSet: List[Question]
    currentQuestionIndex: int = 0
    answers: List[AnswerRecord] = []
    mode: str = "Hybrid"
    interviewerNotes: str = ""
    isCompleted: bool = False
    evaluationResult: Optional[EvaluationResult] = None

class InterviewRecord(BaseModel):
    id: str
    candidateId: str
    candidateName: str
    candidateRole: str
    interviewerId: str
    interviewerName: str
    hiringManagerId: str
    date: str
    status: str  # Completed, In Progress, Feedback Pending
    mode: str
    totalScore: int
    recommendation: str
    competencyScores: CompetencyScores
    summary: InterviewSummary
    workdaySynced: bool = False
    workdaySyncTimestamp: Optional[str] = None
    slackNotified: bool = False
    slackNotificationTimestamp: Optional[str] = None
