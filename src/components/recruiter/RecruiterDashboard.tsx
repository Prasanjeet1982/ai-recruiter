import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  Search, 
  Filter, 
  Play, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  UserCheck,
  Building,
  BarChart3,
  PieChart as PieIcon,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { ScheduleInterviewModal } from '../modals/ScheduleInterviewModal';
import { CandidateComparisonModal } from '../modals/CandidateComparisonModal';

export const RecruiterDashboard: React.FC = () => {
  const { 
    candidates, 
    historicalInterviews, 
    interviewers, 
    startInterview, 
    setActiveView,
    setDemoStep
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [scheduleModalCandidate, setScheduleModalCandidate] = useState<Candidate | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Computed Metrics
  const totalInterviews = historicalInterviews.length + candidates.filter(c => c.interviewStage === 'Interview In Progress').length;
  const completedCount = historicalInterviews.filter(h => h.status === 'Completed').length;
  const pendingScheduled = candidates.filter(c => c.interviewStage === 'Scheduled').length;
  const pendingFeedback = candidates.filter(c => c.interviewStage === 'Feedback Pending').length + historicalInterviews.filter(h => h.status === 'Feedback Pending').length;
  const avgFeedbackTime = "2.1 hrs";
  const interviewerUtilization = "84.6%";

  // Funnel Data
  const funnelData = [
    { stage: 'Applied / Sourced', count: 120, fill: '#3b82f6' },
    { stage: 'AI Resume Screened', count: 68, fill: '#6366f1' },
    { stage: 'Interviews Scheduled', count: 32, fill: '#8b5cf6' },
    { stage: 'Copilot Completed', count: completedCount, fill: '#0284c7' },
    { stage: 'Offer Extended', count: 18, fill: '#10b981' },
    { stage: 'Hired', count: 14, fill: '#059669' },
  ];

  // Outcome Distribution Data
  const outcomeStats = useMemo(() => {
    let strongHire = 0, hire = 0, borderline = 0, noHire = 0;
    historicalInterviews.forEach(h => {
      if (h.recommendation === 'Strong Hire') strongHire++;
      else if (h.recommendation === 'Hire') hire++;
      else if (h.recommendation === 'Borderline') borderline++;
      else if (h.recommendation === 'No Hire') noHire++;
    });
    return [
      { name: 'Strong Hire', value: strongHire, color: '#10b981' },
      { name: 'Hire', value: hire, color: '#3b82f6' },
      { name: 'Borderline', value: borderline, color: '#f59e0b' },
      { name: 'No Hire', value: noHire, color: '#f43f5e' },
    ];
  }, [historicalInterviews]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchRole = roleFilter === 'All' || c.role === roleFilter;
      const matchStage = stageFilter === 'All' || c.interviewStage === stageFilter;
      const matchSearch = searchQuery === '' || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchStage && matchSearch;
    });
  }, [candidates, roleFilter, stageFilter, searchQuery]);

  const toggleCompareSelect = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare at most 3 candidates simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleLaunchInterview = (candidate: Candidate) => {
    startInterview(candidate.id);
    setDemoStep(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Activity size={18} />
            </span>
            <h1 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
              Enterprise Recruiter Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline monitoring, automated interviewer matching, and AI copilot execution tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Layers size={14} />
              <span>Compare Candidates ({selectedForCompare.length})</span>
            </button>
          )}

          <button
            onClick={() => handleLaunchInterview(candidates[0])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all scale-[1.02]"
          >
            <Sparkles size={14} className="text-cyan-200" />
            <span>Launch Quick AI Demo (Dr. Elena)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Interviews</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 font-heading">{totalInterviews}</span>
            <span className="text-[11px] text-emerald-600 block font-semibold">+14% this month</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-700 font-heading">{completedCount}</span>
            <span className="text-[11px] text-slate-500 block font-medium">Validated via Copilot</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Scheduled</span>
            <Clock size={16} className="text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-indigo-700 font-heading">{pendingScheduled}</span>
            <span className="text-[11px] text-slate-500 block font-medium">Next 48 Hours</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Feedback</span>
            <AlertCircle size={16} className="text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-amber-600 font-heading">{pendingFeedback}</span>
            <span className="text-[11px] text-amber-700 block font-semibold">Requires Follow-up</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviewer Load</span>
            <BarChart3 size={16} className="text-cyan-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-cyan-800 font-heading">{interviewerUtilization}</span>
            <span className="text-[11px] text-emerald-600 block font-semibold">Optimal Band</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg Feedback Time</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-700 font-heading">{avgFeedbackTime}</span>
            <span className="text-[11px] text-emerald-600 block font-semibold">Down from 48 hrs</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Funnel & Volume Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" />
                Hiring Funnel & Conversion Velocity
              </h2>
              <p className="text-xs text-slate-500">Candidate flow from resume screening to final offer</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              Live Stage Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" stroke="#475569" tick={{ fontSize: 11 }} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${value} Candidates`, 'Pipeline Volume']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Distribution Pie */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <PieIcon size={16} className="text-blue-600" />
                Outcome Distribution
              </h2>
              <p className="text-xs text-slate-500">Historical AI recommendation breakdown</p>
            </div>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {outcomeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any, name: any) => [`${value} Candidates (${Math.round((Number(value) / 50) * 100)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {outcomeStats.map(stat => (
              <div key={stat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                <span className="text-slate-600 font-medium">{stat.name}:</span>
                <span className="text-slate-900 font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              Candidate Pipeline & Active Requisitions ({filteredCandidates.length})
            </h2>
            <p className="text-xs text-slate-500">Select candidate to start AI-assisted interview or inspect evaluation profiles</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search name, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter candidates by role"
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All">All Roles (5)</option>
              <option value="GenAI Engineer">GenAI Engineer</option>
              <option value="AI Architect">AI Architect</option>
              <option value="Data Engineer">Data Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              aria-label="Filter candidates by stage"
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All">All Stages</option>
              <option value="Screening">Screening</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Feedback Pending">Feedback Pending</option>
            </select>
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-8">Compare</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role & Experience</th>
                <th className="py-3 px-4">Core Skills</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Assigned Interviewer</th>
                <th className="py-3 px-4">Score / Rec</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCandidates.map((cand) => {
                const isSelected = selectedForCompare.includes(cand.id);

                return (
                  <tr 
                    key={cand.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    {/* Compare Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCompareSelect(cand.id)}
                        aria-label={`Select ${cand.name} for comparison`}
                        className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Candidate Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={cand.avatarUrl} 
                          alt={cand.name} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                            {cand.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">{cand.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Experience */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-semibold block">{cand.role}</span>
                      <span className="text-[11px] text-slate-500">{cand.experienceYears} Years Exp</span>
                    </td>

                    {/* Skills Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.skills.slice(0, 3).map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {cand.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold px-1">
                            +{cand.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stage Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        cand.interviewStage === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cand.interviewStage === 'Scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : cand.interviewStage === 'Feedback Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {cand.interviewStage}
                      </span>
                    </td>

                    {/* Assigned Interviewer */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 block font-medium">{cand.assignedInterviewerName.split(' (')[0]}</span>
                      <span className="text-[10px] text-slate-400">{cand.assignedInterviewerName.split(' (')[1]?.replace(')', '') || 'Lead Evaluator'}</span>
                    </td>

                    {/* Score / Rec */}
                    <td className="py-3.5 px-4">
                      {cand.overallScore ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm">{cand.overallScore}%</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              cand.recommendation === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                              cand.recommendation === 'Hire' ? 'bg-blue-100 text-blue-800' :
                              cand.recommendation === 'Borderline' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {cand.recommendation}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not evaluated</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {cand.interviewStage === 'Scheduled' || cand.interviewStage === 'Screening' ? (
                          <button
                            onClick={() => handleLaunchInterview(cand)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <Play size={12} fill="currentColor" />
                            <span>Start Interview</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLaunchInterview(cand)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
                          >
                            <span>View Session</span>
                            <ArrowRight size={12} />
                          </button>
                        )}

                        <button
                          onClick={() => setScheduleModalCandidate(cand)}
                          title="Reschedule or assign interviewer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200"
                        >
                          <Calendar size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {scheduleModalCandidate && (
        <ScheduleInterviewModal
          candidate={scheduleModalCandidate}
          onClose={() => setScheduleModalCandidate(null)}
        />
      )}

      {isCompareModalOpen && (
        <CandidateComparisonModal
          candidateIds={selectedForCompare}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </div>
  );
};
