from typing import List, Optional
from pydantic import BaseModel, Field

class PredefinedResponse(BaseModel):
    id: str
    label: str
    transcript: Optional[str] = None
    candidateTranscript: Optional[str] = None
    score: int  # 1 - 10
    strength: str
    weakness: str
    followUpQuestions: List[str] = Field(default_factory=list)

    def get_transcript(self) -> str:
        return self.transcript or self.candidateTranscript or ""

class Question(BaseModel):
    questionId: str
    role: str
    difficulty: str  # Beginner, Intermediate, Advanced
    questionType: str  # MCQ, Subjective, Scenario
    competency: str  # Technical Knowledge, Problem Solving, Communication, Architecture Skills, Coding Skills
    question: str
    scenarioContext: Optional[str] = None
    options: Optional[List[str]] = None
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None
    score: int = 10
    predefinedResponses: Optional[List[PredefinedResponse]] = None
