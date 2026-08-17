import { AnswerRecord, Question, CompetencyScore } from '../types';

export interface EvaluationResult {
  totalScore: number;
  recommendation: 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';
  recommendationRationale: string;
  competencies: {
    technicalKnowledge: number;
    problemSolving: number;
    communication: number;
    architectureSkills: number;
    codingSkills: number;
  };
  strengths: string[];
  weaknesses: string[];
  keyObservations: string[];
  areasForImprovement: string[];
  overallSummary: string;
}

export function evaluateInterview(
  role: string,
  candidateName: string,
  answers: AnswerRecord[],
  questions: Question[],
  interviewerNotes?: string
): EvaluationResult {
  if (!answers || answers.length === 0) {
    return {
      totalScore: 0,
      recommendation: 'No Hire',
      recommendationRationale: 'No questions were evaluated.',
      competencies: {
        technicalKnowledge: 1,
        problemSolving: 1,
        communication: 1,
        architectureSkills: 1,
        codingSkills: 1
      },
      strengths: ['Interview in progress'],
      weaknesses: ['Evaluation incomplete'],
      keyObservations: ['Session started'],
      areasForImprovement: ['Complete all interview questions'],
      overallSummary: 'The interview is currently in progress.'
    };
  }

  // Calculate raw scores and competency breakdowns
  let earnedScore = 0;
  let maxPossibleScore = 0;

  const competencyTotals: Record<string, { earned: number; max: number; count: number }> = {
    'Technical Knowledge': { earned: 0, max: 0, count: 0 },
    'Problem Solving': { earned: 0, max: 0, count: 0 },
    'Communication': { earned: 0, max: 0, count: 0 },
    'Architecture Skills': { earned: 0, max: 0, count: 0 },
    'Coding Skills': { earned: 0, max: 0, count: 0 }
  };

  const strengthsList: string[] = [];
  const weaknessesList: string[] = [];

  answers.forEach(ans => {
    const q = questions.find(item => item.questionId === ans.questionId);
    const qMax = q ? q.score : 10;
    const qComp = q ? q.competency : (ans.competency || 'Technical Knowledge');

    earnedScore += ans.scoreAwarded;
    maxPossibleScore += qMax;

    if (!competencyTotals[qComp]) {
      competencyTotals[qComp] = { earned: 0, max: 0, count: 0 };
    }
    competencyTotals[qComp].earned += ans.scoreAwarded;
    competencyTotals[qComp].max += qMax;
    competencyTotals[qComp].count += 1;

    if (ans.copilotFeedback) {
      if (ans.copilotFeedback.strength && ans.scoreAwarded >= 7) {
        strengthsList.push(ans.copilotFeedback.strength);
      }
      if (ans.copilotFeedback.weakness && ans.scoreAwarded < 9 && !ans.copilotFeedback.weakness.includes('None')) {
        weaknessesList.push(ans.copilotFeedback.weakness);
      }
    } else if (ans.isCorrect) {
      strengthsList.push(`Accurately answered ${q?.difficulty || 'core'} ${qComp} question.`);
    } else if (ans.isCorrect === false) {
      weaknessesList.push(`Missed key concept in ${qComp}: ${q?.question.substring(0, 60)}...`);
    }
  });

  const normalizedPercentage = maxPossibleScore > 0 
    ? Math.round((earnedScore / maxPossibleScore) * 100) 
    : 0;

  // Compute 1-5 scale for each competency
  const mapToFiveScale = (compName: string, fallbackDefault: number): number => {
    const data = competencyTotals[compName];
    if (!data || data.max === 0) return fallbackDefault;
    const ratio = data.earned / data.max;
    // Scale 0..1 to 1..5
    return Math.min(5, Math.max(1, Math.round(ratio * 4 + 1)));
  };

  const compScores = {
    technicalKnowledge: mapToFiveScale('Technical Knowledge', Math.max(1, Math.round(normalizedPercentage / 20))),
    problemSolving: mapToFiveScale('Problem Solving', Math.max(1, Math.round((normalizedPercentage * 0.95) / 20))),
    communication: mapToFiveScale('Communication', 4), // Default solid communication in simulated interview
    architectureSkills: mapToFiveScale('Architecture Skills', Math.max(1, Math.round((normalizedPercentage * 0.9) / 20))),
    codingSkills: mapToFiveScale('Coding Skills', Math.max(1, Math.round(normalizedPercentage / 20)))
  };

  // Rule-based Recommendation
  let recommendation: 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';
  let recommendationRationale: string;

  if (normalizedPercentage >= 85) {
    recommendation = 'Strong Hire';
    recommendationRationale = `Candidate achieved a stellar score of ${normalizedPercentage}%, demonstrating deep technical mastery and clear architectural articulation for the ${role} position. Highly recommended for immediate offer.`;
  } else if (normalizedPercentage >= 70) {
    recommendation = 'Hire';
    recommendationRationale = `Candidate demonstrated solid core competency with an overall score of ${normalizedPercentage}%. Possesses strong execution abilities with minor coaching opportunities in high-scale scenarios.`;
  } else if (normalizedPercentage >= 50) {
    recommendation = 'Borderline';
    recommendationRationale = `Candidate scored ${normalizedPercentage}%, showing basic foundational knowledge but notable gaps in advanced problem solving and architecture. Recommend a follow-up panel or leveling discussion.`;
  } else {
    recommendation = 'No Hire';
    recommendationRationale = `Candidate scored ${normalizedPercentage}%, falling below the benchmark threshold for the ${role} role. Critical competencies were not demonstrated.`;
  }

  // Deduplicate strengths/weaknesses
  const finalStrengths = Array.from(new Set(strengthsList)).slice(0, 4);
  if (finalStrengths.length === 0) {
    finalStrengths.push(`Solid grasp of fundamental ${role} principles.`);
  }

  const finalWeaknesses = Array.from(new Set(weaknessesList)).slice(0, 3);
  if (finalWeaknesses.length === 0) {
    finalWeaknesses.push('No significant technical deficiencies identified.');
  }

  const keyObservations = [
    `${candidateName} demonstrated ${normalizedPercentage >= 70 ? 'strong confidence' : 'hesitation'} when defending technical trade-offs.`,
    `Performance was consistently high in ${Object.entries(compScores).sort((a, b) => b[1] - a[1])[0][0].replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
    interviewerNotes ? `Interviewer Note: ${interviewerNotes}` : 'Engaged constructively with copilot follow-up prompts.'
  ];

  const areasForImprovement = finalWeaknesses.map(w => `Focus on: ${w}`);

  const overallSummary = `${candidateName} completed the structured ${role} evaluation with an aggregate score of ${normalizedPercentage}/100 (${recommendation}). ${
    recommendation === 'Strong Hire' 
      ? 'The candidate excels in complex problem solving and modern engineering patterns with exceptional clarity.'
      : recommendation === 'Hire'
      ? 'The candidate demonstrates dependable practical abilities and meets all baseline technical requirements.'
      : recommendation === 'Borderline'
      ? 'The candidate demonstrates basic literacy but struggled with senior-level architectural constraints.'
      : 'The candidate failed to demonstrate sufficient foundational competency for this role.'
  }`;

  return {
    totalScore: normalizedPercentage,
    recommendation,
    recommendationRationale,
    competencies: compScores,
    strengths: finalStrengths,
    weaknesses: finalWeaknesses,
    keyObservations,
    areasForImprovement,
    overallSummary
  };
}
