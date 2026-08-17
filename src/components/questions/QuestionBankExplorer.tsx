import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  HelpCircle, 
  CheckCircle2, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Layers, 
  Sparkles,
  Bot
} from 'lucide-react';

export const QuestionBankExplorer: React.FC = () => {
  const { questions } = useApp();
  
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchRole = roleFilter === 'All' || q.role === roleFilter;
      const matchDiff = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchType = typeFilter === 'All' || q.questionType === typeFilter;
      const matchSearch = searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.competency.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchDiff && matchType && matchSearch;
    });
  }, [questions, roleFilter, difficultyFilter, typeFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <BookOpen size={18} />
            </span>
            <h1 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
              Enterprise Question Bank Repository
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse {questions.length} calibrated questions across 5 engineering roles with predefined candidate responses and Copilot follow-up mappers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200">
          <Sparkles size={14} className="text-blue-600" />
          <span>{filteredQuestions.length} Questions Filtered</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question text, ID, or competency..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by role"
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Roles ({questions.length})</option>
            <option value="GenAI Engineer">GenAI Engineer (20)</option>
            <option value="AI Architect">AI Architect (20)</option>
            <option value="Data Engineer">Data Engineer (20)</option>
            <option value="Full Stack Engineer">Full Stack Engineer (20)</option>
            <option value="DevOps Engineer">DevOps Engineer (20)</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Filter by difficulty"
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by question type"
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Question Types</option>
            <option value="MCQ">MCQ (Auto-Scored)</option>
            <option value="Subjective">Subjective (Predefined Responses)</option>
            <option value="Scenario">Scenario-Based</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQId === q.questionId;

          return (
            <div 
              key={q.questionId}
              className="rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs transition-all overflow-hidden"
            >
              <div 
                onClick={() => setExpandedQId(isExpanded ? null : q.questionId)}
                className="p-4 cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{q.questionId}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {q.role}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      q.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      q.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.questionType}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      Competency: <strong className="text-slate-800">{q.competency}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-heading leading-snug pt-1">
                    {q.question}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{q.score} Pts</span>
                  <button className="p-1 text-slate-400 hover:text-slate-700">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Question Details */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 space-y-3 text-xs">
                  
                  {/* Scenario Context */}
                  {q.scenarioContext && (
                    <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-medium">
                      <strong className="block text-indigo-700 mb-1">Scenario Context:</strong>
                      "{q.scenarioContext}"
                    </div>
                  )}

                  {/* MCQ Options */}
                  {q.questionType === 'MCQ' && q.options && (
                    <div className="space-y-1.5 pt-2">
                      <span className="font-bold text-slate-600 block text-[11px]">Options:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, idx) => (
                          <div 
                            key={idx}
                            className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                              opt === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 text-center font-bold text-xs flex items-center justify-center border border-slate-200">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-[11px]">{opt}</span>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-[11px] text-slate-600 pt-1">
                          <strong className="text-blue-700">Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Predefined Subjective Responses & Follow-ups */}
                  {q.predefinedResponses && (
                    <div className="space-y-2 pt-2">
                      <span className="font-bold text-slate-600 block text-[11px]">Predefined Evaluation Responses:</span>
                      <div className="space-y-2">
                        {q.predefinedResponses.map((resp) => (
                          <div key={resp.id} className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs">{resp.label}</span>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Score: {resp.score}/10</span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-mono italic">"{resp.candidateTranscript}"</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
                              <span className="text-emerald-700"><strong>Strength:</strong> {resp.strength}</span>
                              <span className="text-amber-700"><strong>Gap:</strong> {resp.weakness}</span>
                            </div>
                            {resp.followUpQuestions && (
                              <div className="pt-1.5 border-t border-slate-100 text-[10px] text-blue-800 font-medium">
                                <strong>Follow-ups:</strong> {resp.followUpQuestions.join(' • ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
