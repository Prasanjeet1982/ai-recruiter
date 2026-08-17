import time
from datetime import datetime, timezone
from typing import Optional
from app.services.data_store import data_store
from app.models.workday import WorkdayRecord

class WorkdayService:
    def sync_interview_feedback(self, interview_id: Optional[str] = None) -> WorkdayRecord:
        if interview_id:
            record = next((r for r in data_store.historical_interviews if r.id == interview_id), None)
        else:
            record = data_store.historical_interviews[0] if data_store.historical_interviews else None

        if not record:
            raise ValueError("No interview record available to sync to Workday.")

        req_num = f"REQ-2026-{int(time.time() * 100) % 900 + 100}"
        wd_id = f"WD-{int(time.time() * 1000) % 10000}"

        wd_record = WorkdayRecord(
            id=wd_id,
            reqNumber=req_num,
            jobTitle=record.candidateRole,
            candidateId=record.candidateId,
            candidateName=record.candidateName,
            stage="Interview Completed - Ready for Offer",
            submittedBy=record.interviewerName,
            submittedAt=datetime.now(timezone.utc).isoformat(),
            scorecardStatus="Submitted",
            overallRating=f"{record.recommendation} ({record.totalScore}/100)",
            recommendation=record.recommendation,
            notes=record.summary.overallSummary
        )

        data_store.add_workday_record(wd_record)
        record.workdaySynced = True
        record.workdaySyncTimestamp = datetime.now(timezone.utc).isoformat()
        data_store.demo_step = 8
        return wd_record

workday_service = WorkdayService()
