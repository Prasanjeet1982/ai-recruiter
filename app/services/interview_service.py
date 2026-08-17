import time
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.services.data_store import data_store
from app.services.scoring_engine import evaluate_interview_answers
from app.models.interview import ActiveInterviewSession, AnswerRecord, InterviewRecord, InterviewSummary, CompetencyScores
from app.models.question import Question

class InterviewService:
    def start_interview(
        self,
        candidate_id: str,
        interviewer_id: Optional[str] = None,
        mode: str = "Hybrid"
    ) -> ActiveInterviewSession:
        candidate = data_store.get_candidate(candidate_id) or data_store.candidates[0]
        
        inv_id = interviewer_id or candidate.assignedInterviewerId
        interviewer = next((i for i in data_store.interviewers if i.id == inv_id), data_store.interviewers[0])

        # Filter questions for role
        role_questions = [q for q in data_store.questions if q.role == candidate.role]
        mcqs = [q for q in role_questions if q.questionType == "MCQ"][:4]
        subjs = [q for q in role_questions if q.questionType == "Subjective"][:4]
        scenarios = [q for q in role_questions if q.questionType == "Scenario"][:2]

        selected_questions = mcqs + subjs + scenarios
        if len(selected_questions) < 10:
            selected_questions = role_questions[:10]

        session = ActiveInterviewSession(
            candidate=candidate,
            interviewer=interviewer,
            questionSet=selected_questions,
            currentQuestionIndex=0,
            answers=[],
            mode=mode,
            interviewerNotes="",
            isCompleted=False
        )

        data_store.active_session = session
        data_store.demo_step = 2
        return session

    def record_answer(self, answer: AnswerRecord) -> ActiveInterviewSession:
        session = data_store.active_session
        if not session:
            raise ValueError("No active interview session found.")

        # Update or append answer
        filtered = [a for a in session.answers if a.questionId != answer.questionId]
        filtered.append(answer)
        session.answers = filtered

        # Re-evaluate live
        eval_result = evaluate_interview_answers(
            role=session.candidate.role,
            candidate_name=session.candidate.name,
            answers=session.answers,
            questions=session.questionSet,
            interviewer_notes=session.interviewerNotes
        )
        session.evaluationResult = eval_result
        data_store.active_session = session
        return session

    def complete_interview(self) -> InterviewRecord:
        session = data_store.active_session
        if not session:
            raise ValueError("No active interview session found.")

        eval_result = evaluate_interview_answers(
            role=session.candidate.role,
            candidate_name=session.candidate.name,
            answers=session.answers,
            questions=session.questionSet,
            interviewer_notes=session.interviewerNotes
        )

        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        rec_id = f"INT-REC-{int(time.time() * 1000) % 10000}"

        record = InterviewRecord(
            id=rec_id,
            candidateId=session.candidate.id,
            candidateName=session.candidate.name,
            candidateRole=session.candidate.role,
            interviewerId=session.interviewer.id,
            interviewerName=session.interviewer.name,
            hiringManagerId=session.candidate.hiringManagerId,
            date=today_str,
            status="Completed",
            mode=session.mode,
            totalScore=eval_result.totalScore,
            recommendation=eval_result.recommendation,
            competencyScores=eval_result.competencies,
            summary=InterviewSummary(
                strengths=eval_result.strengths,
                weaknesses=eval_result.weaknesses,
                keyObservations=eval_result.keyObservations,
                areasForImprovement=eval_result.areasForImprovement,
                overallSummary=eval_result.overallSummary
            ),
            workdaySynced=False,
            slackNotified=False
        )

        data_store.add_historical_interview(record)
        data_store.update_candidate(session.candidate.id, {
            "interviewStage": "Completed",
            "overallScore": eval_result.totalScore,
            "recommendation": eval_result.recommendation
        })

        session.isCompleted = True
        session.evaluationResult = eval_result
        data_store.active_session = session
        data_store.demo_step = 6
        return record

interview_service = InterviewService()
