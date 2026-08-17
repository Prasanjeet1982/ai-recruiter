from typing import List, Dict, Optional, Tuple
from app.models.interview import AnswerRecord, EvaluationResult, CompetencyScores
from app.models.question import Question

def evaluate_interview_answers(
    role: str,
    candidate_name: str,
    answers: List[AnswerRecord],
    questions: List[Question],
    interviewer_notes: str = ""
) -> EvaluationResult:
    """
    Pure deterministic rule-based evaluation engine.
    Calculates competency breakdown (1-5), aggregate score (0-100),
    and hiring recommendation based on strict business logic.
    """
    if not answers:
        return EvaluationResult(
            totalScore=0,
            recommendation="No Hire",
            recommendationRationale="No questions were evaluated.",
            competencies=CompetencyScores(
                technicalKnowledge=1,
                problemSolving=1,
                communication=1,
                architectureSkills=1,
                codingSkills=1
            ),
            strengths=["Interview in progress"],
            weaknesses=["Evaluation incomplete"],
            keyObservations=["Session started"],
            areasForImprovement=["Complete all interview questions"],
            overallSummary="The interview is currently in progress."
        )

    q_map: Dict[str, Question] = {q.questionId: q for q in questions}

    earned_score = 0
    max_score = 0

    comp_totals = {
        "Technical Knowledge": {"earned": 0, "max": 0},
        "Problem Solving": {"earned": 0, "max": 0},
        "Communication": {"earned": 0, "max": 0},
        "Architecture Skills": {"earned": 0, "max": 0},
        "Coding Skills": {"earned": 0, "max": 0},
    }

    strengths_list = []
    weaknesses_list = []

    for ans in answers:
        q = q_map.get(ans.questionId)
        q_max = q.score if q else 10
        q_comp = q.competency if q else ans.competency

        earned_score += ans.scoreAwarded
        max_score += q_max

        if q_comp not in comp_totals:
            comp_totals[q_comp] = {"earned": 0, "max": 0}

        comp_totals[q_comp]["earned"] += ans.scoreAwarded
        comp_totals[q_comp]["max"] += q_max

        if ans.copilotFeedback:
            if ans.copilotFeedback.strength and ans.scoreAwarded >= 7:
                strengths_list.append(ans.copilotFeedback.strength)
            if ans.copilotFeedback.weakness and ans.scoreAwarded < 9 and "None" not in ans.copilotFeedback.weakness:
                weaknesses_list.append(ans.copilotFeedback.weakness)
        elif ans.isCorrect:
            strengths_list.append(f"Accurately answered core {q_comp} question.")
        elif ans.isCorrect is False:
            q_text = q.question[:60] if q else "concept"
            weaknesses_list.append(f"Missed key concept in {q_comp}: {q_text}...")

    normalized_percentage = round((earned_score / max_score) * 100) if max_score > 0 else 0

    def calc_1_to_5_score(comp_name: str, fallback: int) -> int:
        data = comp_totals.get(comp_name)
        if not data or data["max"] == 0:
            return fallback
        ratio = data["earned"] / data["max"]
        return min(5, max(1, round(ratio * 4 + 1)))

    tech_score = calc_1_to_5_score("Technical Knowledge", max(1, round(normalized_percentage / 20)))
    prob_score = calc_1_to_5_score("Problem Solving", max(1, round((normalized_percentage * 0.95) / 20)))
    comm_score = calc_1_to_5_score("Communication", 4)
    arch_score = calc_1_to_5_score("Architecture Skills", max(1, round((normalized_percentage * 0.9) / 20)))
    code_score = calc_1_to_5_score("Coding Skills", max(1, round(normalized_percentage / 20)))

    # Recommendation Rules
    if normalized_percentage >= 85:
        recommendation = "Strong Hire"
        recommendation_rationale = (
            f"Candidate achieved a standout score of {normalized_percentage}%, demonstrating deep technical "
            f"mastery and architectural reasoning for the {role} role. Highly recommended for immediate offer."
        )
    elif normalized_percentage >= 70:
        recommendation = "Hire"
        recommendation_rationale = (
            f"Candidate demonstrated solid technical fundamentals with an overall score of {normalized_percentage}%. "
            f"Possesses strong execution abilities with minor coaching opportunities in high-scale scenarios."
        )
    elif normalized_percentage >= 50:
        recommendation = "Borderline"
        recommendation_rationale = (
            f"Candidate scored {normalized_percentage}%, showing acceptable foundational literacy but noticeable "
            f"gaps in advanced problem solving and architecture. Recommend a leveling discussion."
        )
    else:
        recommendation = "No Hire"
        recommendation_rationale = (
            f"Candidate scored {normalized_percentage}%, falling below the benchmark threshold for the {role} role. "
            f"Critical competencies were not demonstrated."
        )

    # Deduplicate strengths / weaknesses
    final_strengths = list(dict.fromkeys(strengths_list))[:4]
    if not final_strengths:
        final_strengths.append(f"Solid grasp of fundamental {role} engineering concepts.")

    final_weaknesses = list(dict.fromkeys(weaknesses_list))[:3]
    if not final_weaknesses:
        final_weaknesses.append("No significant technical deficiencies identified.")

    key_observations = [
        f"{candidate_name} demonstrated {'high confidence' if normalized_percentage >= 70 else 'hesitation'} when defending technical trade-offs.",
        f"Strongest demonstrated competency was in {role} execution methodologies.",
        f"Interviewer Note: {interviewer_notes}" if interviewer_notes else "Engaged constructively with copilot follow-up prompts."
    ]

    areas_for_improvement = [f"Focus on: {w}" for w in final_weaknesses]

    narrative = (
        f"{candidate_name} completed the structured {role} assessment with an aggregate score of "
        f"{normalized_percentage}/100 ({recommendation}). "
    )
    if recommendation == "Strong Hire":
        narrative += "The candidate excels in complex problem solving and modern engineering patterns with exceptional clarity."
    elif recommendation == "Hire":
        narrative += "The candidate demonstrates dependable practical abilities and meets all baseline technical requirements."
    elif recommendation == "Borderline":
        narrative += "The candidate demonstrates basic literacy but struggled with senior-level architectural constraints."
    else:
        narrative += "The candidate failed to demonstrate sufficient foundational competency for this role."

    return EvaluationResult(
        totalScore=normalized_percentage,
        recommendation=recommendation,
        recommendationRationale=recommendation_rationale,
        competencies=CompetencyScores(
            technicalKnowledge=tech_score,
            problemSolving=prob_score,
            communication=comm_score,
            architectureSkills=arch_score,
            codingSkills=code_score
        ),
        strengths=final_strengths,
        weaknesses=final_weaknesses,
        keyObservations=key_observations,
        areasForImprovement=areas_for_improvement,
        overallSummary=narrative
    )
