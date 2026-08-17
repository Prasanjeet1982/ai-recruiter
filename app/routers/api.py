from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

from app.models.candidate import Candidate, Interviewer, HiringManager
from app.models.question import Question
from app.models.interview import ActiveInterviewSession, AnswerRecord, InterviewRecord
from app.models.workday import WorkdayRecord
from app.models.slack import SlackMessage
from app.services.data_store import data_store
from app.services.interview_service import interview_service
from app.services.workday_service import workday_service
from app.services.slack_service import slack_service

router = APIRouter(prefix="/api", tags=["Interview Platform API"])

class StartInterviewRequest(BaseModel):
    candidateId: str
    interviewerId: Optional[str] = None
    mode: Optional[str] = "Hybrid"

class NotesRequest(BaseModel):
    notes: str

class ScheduleRequest(BaseModel):
    candidateId: str
    interviewerId: str
    date: str
    time: str

class SlackNotificationRequest(BaseModel):
    type: str  # interview_completed, reminder, scheduled, offer_approval
    data: Optional[Dict[str, Any]] = None

@router.get("/candidates", response_model=List[Candidate])
def get_candidates(
    role: Optional[str] = Query(None),
    stage: Optional[str] = Query(None)
):
    results = data_store.candidates
    if role and role != "All":
        results = [c for c in results if c.role == role]
    if stage and stage != "All":
        results = [c for c in results if c.interviewStage == stage]
    return results

@router.get("/candidates/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: str):
    c = data_store.get_candidate(candidate_id)
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return c

@router.get("/interviewers", response_model=List[Interviewer])
def get_interviewers():
    return data_store.interviewers

@router.get("/hiring-managers", response_model=List[HiringManager])
def get_hiring_managers():
    return data_store.hiring_managers

@router.get("/questions", response_model=List[Question])
def get_questions(
    role: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    questionType: Optional[str] = Query(None)
):
    results = data_store.questions
    if role and role != "All":
        results = [q for q in results if q.role == role]
    if difficulty and difficulty != "All":
        results = [q for q in results if q.difficulty == difficulty]
    if questionType and questionType != "All":
        results = [q for q in results if q.questionType == questionType]
    return results

@router.get("/historical", response_model=List[InterviewRecord])
def get_historical_interviews():
    return data_store.historical_interviews

@router.get("/workday", response_model=List[WorkdayRecord])
def get_workday_records():
    return data_store.workday_records

@router.get("/slack", response_model=List[SlackMessage])
def get_slack_messages():
    return data_store.slack_messages

@router.get("/session", response_model=Optional[ActiveInterviewSession])
def get_active_session():
    return data_store.active_session

@router.post("/session/start", response_model=ActiveInterviewSession)
def start_session(req: StartInterviewRequest):
    return interview_service.start_interview(
        candidate_id=req.candidateId,
        interviewer_id=req.interviewerId,
        mode=req.mode or "Hybrid"
    )

@router.post("/session/answer", response_model=ActiveInterviewSession)
def submit_answer(answer: AnswerRecord):
    try:
        return interview_service.record_answer(answer)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/session/notes", response_model=ActiveInterviewSession)
def update_notes(req: NotesRequest):
    if not data_store.active_session:
        raise HTTPException(status_code=400, detail="No active session.")
    data_store.active_session.interviewerNotes = req.notes
    return data_store.active_session

@router.post("/session/complete", response_model=InterviewRecord)
def complete_session():
    try:
        return interview_service.complete_interview()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/workday/sync", response_model=WorkdayRecord)
def sync_workday(interviewId: Optional[str] = None):
    try:
        return workday_service.sync_interview_feedback(interviewId)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/slack/notify", response_model=SlackMessage)
def send_slack(req: SlackNotificationRequest):
    return slack_service.post_notification(req.type, req.data)

@router.post("/schedule")
def schedule_candidate(req: ScheduleRequest):
    inv = next((i for i in data_store.interviewers if i.id == req.interviewerId), None)
    inv_name = inv.name if inv else "Technical Evaluator"
    cand = data_store.update_candidate(req.candidateId, {
        "interviewStage": "Scheduled",
        "assignedInterviewerId": req.interviewerId,
        "assignedInterviewerName": inv_name
    })
    slack_service.post_notification("scheduled", {
        "candidateName": cand.name if cand else "Candidate",
        "interviewerName": inv_name,
        "date": req.date,
        "time": req.time
    })
    return {"status": "success", "candidate": cand}

@router.post("/reset")
def reset_platform_data():
    data_store.reset_to_defaults()
    return {"status": "success", "message": "Demo data reset to factory initial state."}
