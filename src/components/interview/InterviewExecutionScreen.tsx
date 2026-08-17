import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CandidateDossier } from './CandidateDossier';
import { CopilotSidebar } from './CopilotSidebar';
import { AudioVisualizer } from './AudioVisualizer';
import { AnswerRecord, PredefinedResponse } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  FileText, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock,
  Play,
  RotateCcw,
  Zap,
  Bookmark
} from 'lucide-react';

export const InterviewExecutionScreen: React.FC = () => {
  const { 
    activeInterview, 
    startInterview, 
    candidates,
    recordAnswer, 
    nextQuestion, 
    prevQuestion, 
    jumpToQuestion, 
    completeInterview,
    updateInterviewerNotes,
    setActiveView,
    setDemoStep
  } = useApp();

  // If no active session, show prompt or auto-start with Dr. Elena Rostova
  if (!activeInterview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
          <Bot size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            No Active Interview Session
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Select a candidate from the recruiter pipeline to launch the AI Interview Copilot workspace.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => startInterview(candidates[0].id)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            <span>Start Demo with Dr. Elena Rostova</span>
          </button>
          <button
            onClick={() => setActiveView('recruiter')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold border border-slate-200 transition-all"
          >
            Browse Candidates
          </button>
        </div>
      </div>
    );
  }

  const {
    candidate,
    interviewer,
    questionSet,
    currentQuestionIndex,
    answers,
    mode,
    interviewerNotes,
    evaluationResult
  } = activeInterview;

  const currentQ = questionSet[currentQuestionIndex] || questionSet[0];
  const currentAnswer = answers.find(a => a.questionId === currentQ.questionId);

  // Handle MCQ selection
  const handleMcqSelect = (optionText: string) => {
    const isCorrect = optionText === currentQ.correctAnswer;
    const score = isCorrect ? (currentQ.score || 10) : 2;

    const answerRecord: AnswerRecord = {
      questionId: currentQ.questionId,
      questionType: 'MCQ',
      selectedOption: optionText,
      isCorrect,
      scoreAwarded: score,
      competency: currentQ.competency,
      copilotFeedback: {
        strength: isCorrect ? `Accurately identified correct architectural pattern (${optionText}).` : 'Attempted question.',
        weakness: !isCorrect ? `Selected incorrect option (${optionText}). Correct answer was ${currentQ.correctAnswer}: ${currentQ.explanation}` : 'None',
        followUpQuestions: [
          `Why is "${currentQ.correctAnswer}" preferred over alternative options in high-scale systems?`,
          `How would you monitor and measure this in production telemetry?`
        ]
      },
      timestamp: new Date().toISOString()
    };

    recordAnswer(answerRecord);
  };

  // Handle Subjective Response Selection (Response A / Response B / Response C)
  const handleSubjectiveSelect = (resp: PredefinedResponse) => {
    const answerRecord: AnswerRecord = {
      questionId: currentQ.questionId,
      questionType: currentQ.questionType,
      selectedResponseId: resp.id,
      scoreAwarded: resp.score,
      competency: currentQ.competency,
      copilotFeedback: {
        strength: resp.strength,
        weakness: resp.weakness,
        followUpQuestions: resp.followUpQuestions
      },
      timestamp: new Date().toISOString()
    };

    recordAnswer(answerRecord);
  };

  const handleAddFollowUpNote = (text: string) => {
    const updated = interviewerNotes ? `${interviewerNotes}\n• ${text}` : `• ${text}`;
    updateInterviewerNotes(updated);
  };

  const handleFinishInterview = () => {
    completeInterview();
    setDemoStep(6);
  };

  // Active transcript to show in AudioVisualizer
  let activeTranscript = "Listening to candidate audio...";
  if (currentAnswer?.selectedResponseId && currentQ.predefinedResponses) {
    const found = currentQ.predefinedResponses.find(r => r.id === currentAnswer.selectedResponseId);
    if (found) activeTranscript = found.candidateTranscript;
  } else if (currentAnswer?.selectedOption) {
    activeTranscript = `Candidate selected: Option "${currentAnswer.selectedOption}"`;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-4">
      
      {/* Question Stepper Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 font-heading whitespace-nowrap">
            Questions ({answers.length}/{questionSet.length}):
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-nowrap">
          {questionSet.map((q, idx) => {
            const isCurrent = idx === currentQuestionIndex;
            const ans = answers.find(a => a.questionId === q.questionId);
            const isAnswered = !!ans;

            return (
              <button
                key={q.questionId}
                onClick={() => jumpToQuestion(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 border border-blue-700 scale-105'
                    : isAnswered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
                title={`Q${idx + 1}: ${q.question.substring(0, 50)}...`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFinishInterview}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
          >
            <CheckCircle2 size={13} />
            <span>Complete & Generate Scorecard</span>
          </button>
        </div>
      </div>

      {/* 3-Column Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Candidate Dossier (3 cols) */}
        <div className="lg:col-span-3">
          <CandidateDossier candidate={candidate} interviewer={interviewer} />
        </div>

        {/* Center Column: Question & Response Workspace (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Question Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            
            {/* Top Question Metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  Question {currentQuestionIndex + 1} of {questionSet.length}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  currentQ.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  currentQ.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {currentQ.difficulty}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                  {currentQ.questionType}
                </span>
              </div>

              <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                <Zap size={13} /> {currentQ.score} Points
              </span>
            </div>

            {/* Scenario Context (if applicable) */}
            {currentQ.scenarioContext && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider flex items-center gap-1">
                  <Bookmark size={11} /> Enterprise Scenario Context:
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed font-medium">
                  "{currentQ.scenarioContext}"
                </p>
              </div>
            )}

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Audio Waveform & Speech-to-Text Simulation */}
            <AudioVisualizer transcriptText={activeTranscript} />

            {/* Mode 1: MCQ Options */}
            {currentQ.questionType === 'MCQ' && currentQ.options && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Select Candidate Answer:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = currentAnswer?.selectedOption === opt;
                    const isCorrect = opt === currentQ.correctAnswer;
                    const letter = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleMcqSelect(opt)}
                        className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 border ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                              : 'bg-rose-50 border-rose-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {letter}
                        </span>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-800 block">{opt}</span>
                          {isSelected && currentQ.explanation && (
                            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                              <strong className="text-blue-700">Explanation:</strong> {currentQ.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Subjective / Scenario Responses */}
            {(currentQ.questionType === 'Subjective' || currentQ.questionType === 'Scenario') && currentQ.predefinedResponses && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Demonstrated Candidate Response Quality:
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Evaluates Copilot rule engine</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.predefinedResponses.map((resp) => {
                    const isSelected = currentAnswer?.selectedResponseId === resp.id;

                    return (
                      <button
                        key={resp.id}
                        onClick={() => handleSubjectiveSelect(resp)}
                        className={`w-full p-3.5 rounded-xl text-left transition-all border ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-400'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-slate-900 font-heading">
                            {resp.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            resp.score >= 8 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            resp.score >= 5 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            Score: {resp.score}/10
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-700 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed mb-2">
                          "{resp.candidateTranscript}"
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="text-emerald-700 font-medium truncate">
                            &bull; <strong>Strength:</strong> {resp.strength}
                          </div>
                          <div className="text-amber-700 font-medium truncate">
                            &bull; <strong>Gap:</strong> {resp.weakness}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  currentQuestionIndex === 0
                    ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                    : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <span className="text-xs text-slate-600 font-semibold">
                {currentQuestionIndex + 1} of {questionSet.length}
              </span>

              {currentQuestionIndex < questionSet.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>Next Question</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleFinishInterview}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <CheckCircle2 size={14} />
                  <span>Finish & View Scorecard</span>
                </button>
              )}
            </div>
          </div>

          {/* Interviewer Notes Pad */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <FileText size={13} className="text-blue-600" />
                Interviewer Observation Notes
              </span>
              <span className="text-[10px] text-slate-400">Auto-saved to scorecard</span>
            </div>
            <textarea
              rows={3}
              value={interviewerNotes}
              onChange={(e) => updateInterviewerNotes(e.target.value)}
              placeholder="Record custom interviewer impressions, behavioral cues, or follow-up responses here..."
              className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>

        {/* Right Column: AI Copilot Sidebar (3 cols) */}
        <div className="lg:col-span-3">
          <CopilotSidebar
            currentQuestion={currentQ}
            currentAnswer={currentAnswer}
            evaluationResult={evaluationResult}
            onAddFollowUpNote={handleAddFollowUpNote}
            totalQuestionsCount={questionSet.length}
            answeredCount={answers.length}
          />
        </div>
      </div>
    </div>
  );
};
