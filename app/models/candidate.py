from typing import List, Optional
from pydantic import BaseModel

class Candidate(BaseModel):
    id: str
    name: str
    role: str
    experienceYears: int
    skills: List[str]
    resumeSummary: str
    interviewStage: str  # Screening, Scheduled, Interview In Progress, Feedback Pending, Completed, Offer Extended, Rejected
    assignedInterviewerId: str
    assignedInterviewerName: str
    hiringManagerId: str
    email: str
    location: str
    education: str
    targetSalary: str
    avatarUrl: str
    overallScore: Optional[int] = None
    recommendation: Optional[str] = None

class Interviewer(BaseModel):
    id: str
    name: str
    title: str
    department: str
    email: str
    rating: float
    activeInterviewsCount: int
    avatarUrl: str

class HiringManager(BaseModel):
    id: str
    name: str
    title: str
    department: str
    email: str
    openReqs: int
    avatarUrl: str
