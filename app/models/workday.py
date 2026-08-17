from typing import Optional
from pydantic import BaseModel

class WorkdayRecord(BaseModel):
    id: str
    reqNumber: str
    jobTitle: str
    candidateId: str
    candidateName: str
    stage: str
    submittedBy: str
    submittedAt: str
    scorecardStatus: str  # Submitted, Pending Review, Draft
    overallRating: str
    recommendation: str
    notes: str
