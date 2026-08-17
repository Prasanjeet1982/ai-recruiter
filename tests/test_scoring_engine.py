import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.scoring_engine import evaluate_interview_answers
from app.models.interview import AnswerRecord, CopilotFeedback
from app.models.question import Question

client = TestClient(app)

def test_scoring_engine_empty():
    res = evaluate_interview_answers(
        role="GenAI Engineer",
        candidate_name="Test Candidate",
        answers=[],
        questions=[]
    )
    assert res.totalScore == 0
    assert res.recommendation == "No Hire"

def test_scoring_engine_strong_hire():
    q1 = Question(
        questionId="GENAI-001",
        role="GenAI Engineer",
        difficulty="Intermediate",
        questionType="MCQ",
        competency="Technical Knowledge",
        question="What is the primary role of Cross-Attention?",
        correctAnswer="Enables the decoder to attend to the encoder representations",
        score=10
    )
    q2 = Question(
        questionId="GENAI-002",
        role="GenAI Engineer",
        difficulty="Advanced",
        questionType="Subjective",
        competency="Architecture Skills",
        question="How do you handle KV-cache eviction in production LLMs?",
        score=10
    )

    ans1 = AnswerRecord(
        questionId="GENAI-001",
        questionType="MCQ",
        selectedOption="Enables the decoder to attend to the encoder representations",
        isCorrect=True,
        scoreAwarded=10,
        competency="Technical Knowledge",
        copilotFeedback=CopilotFeedback(
            strength="Deep knowledge of Transformer attention mechanisms.",
            weakness="None",
            followUpQuestions=[]
        ),
        timestamp="2026-08-17T00:00:00Z"
    )

    ans2 = AnswerRecord(
        questionId="GENAI-002",
        questionType="Subjective",
        selectedResponseId="RESP-A",
        scoreAwarded=9,
        competency="Architecture Skills",
        copilotFeedback=CopilotFeedback(
            strength="Mastery of PagedAttention and vLLM eviction strategies.",
            weakness="None",
            followUpQuestions=[]
        ),
        timestamp="2026-08-17T00:00:00Z"
    )

    res = evaluate_interview_answers(
        role="GenAI Engineer",
        candidate_name="Dr. Elena Rostova",
        answers=[ans1, ans2],
        questions=[q1, q2],
        interviewer_notes="Articulate and precise."
    )

    assert res.totalScore >= 85
    assert res.recommendation == "Strong Hire"
    assert res.competencies.technicalKnowledge >= 4
    assert len(res.strengths) > 0

def test_scoring_engine_borderline():
    q = Question(
        questionId="DATA-001",
        role="Data Engineer",
        difficulty="Intermediate",
        questionType="MCQ",
        competency="Coding Skills",
        question="Which window function calculates rank without gaps?",
        correctAnswer="DENSE_RANK()",
        score=10
    )
    ans = AnswerRecord(
        questionId="DATA-001",
        questionType="MCQ",
        selectedOption="RANK()",
        isCorrect=False,
        scoreAwarded=6,
        competency="Coding Skills",
        copilotFeedback=CopilotFeedback(
            strength="Basic SQL familiarity.",
            weakness="Confused RANK() with DENSE_RANK().",
            followUpQuestions=[]
        ),
        timestamp="2026-08-17T00:00:00Z"
    )

    res = evaluate_interview_answers(
        role="Data Engineer",
        candidate_name="Alex Rivera",
        answers=[ans],
        questions=[q]
    )

    assert res.totalScore == 60
    assert res.recommendation == "Borderline"

def test_fastapi_candidates_endpoint():
    response = client.get("/api/candidates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 20
    assert data[0]["name"] == "Dr. Elena Rostova"

def test_fastapi_questions_endpoint():
    response = client.get("/api/questions?role=GenAI%20Engineer")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 20

def test_fastapi_interview_flow():
    # 1. Start interview session
    start_resp = client.post("/api/session/start", json={"candidateId": "CAND-101"})
    assert start_resp.status_code == 200
    session_data = start_resp.json()
    assert session_data["candidate"]["name"] == "Dr. Elena Rostova"
    assert len(session_data["questionSet"]) == 10

    # 2. Record answer
    q1 = session_data["questionSet"][0]
    ans_resp = client.post("/api/session/answer", json={
        "questionId": q1["questionId"],
        "questionType": q1["questionType"],
        "selectedOption": q1.get("correctAnswer", "Option A"),
        "isCorrect": True,
        "scoreAwarded": 10,
        "competency": q1["competency"],
        "copilotFeedback": {
            "strength": "Accurate response.",
            "weakness": "None",
            "followUpQuestions": ["Sample probing follow-up?"]
        },
        "timestamp": "2026-08-17T00:00:00Z"
    })
    assert ans_resp.status_code == 200
    updated_session = ans_resp.json()
    assert len(updated_session["answers"]) == 1

    # 3. Complete interview
    complete_resp = client.post("/api/session/complete")
    assert complete_resp.status_code == 200
    summary_data = complete_resp.json()
    assert summary_data["candidateName"] == "Dr. Elena Rostova"
    assert summary_data["status"] == "Completed"

    # 4. Sync to Workday
    wd_resp = client.post("/api/workday/sync")
    assert wd_resp.status_code == 200
    wd_data = wd_resp.json()
    assert "REQ-2026" in wd_data["reqNumber"]

    # 5. Post to Slack
    slack_resp = client.post("/api/slack/notify", json={
        "type": "interview_completed",
        "data": {
            "candidateName": "Dr. Elena Rostova",
            "role": "GenAI Engineer",
            "score": 94,
            "recommendation": "Strong Hire"
        }
    })
    assert slack_resp.status_code == 200
    slack_data = slack_resp.json()
    assert slack_data["channel"] == "interview-updates"
