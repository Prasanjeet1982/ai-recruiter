import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  FileCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { CandidateComparisonModal } from '../modals/CandidateComparisonModal';

export const HiringManagerDashboard: React.FC = () => {
  const { 
    candidates, 
    historicalInterviews, 
    updateCandidateStage, 
    sendSlackNotification,
    setActiveView 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Candidate Rankings (Ranked by overallScore or simulated score)
  const rankedCandidates = useMemo(() => {
    return [...candidates]
      .filter(c => selectedRole === 'All' || c.role === selectedRole)
      .map(c => {
        // Find corresponding historical interview score if exists
        const hist = historicalInterviews.find(h => h.candidateId === c.id || h.candidateName === c.name);
        const score = c.overallScore || (hist ? hist.totalScore : Math.floor(65 + (c.experienceYears * 3.5)));
        const rec = c.recommendation || (hist ? hist.recommendation : (score >= 85 ? 'Strong Hire' : score >= 70 ? 'Hire' : score >= 50 ? 'Borderline' : 'No Hire'));
        return {
          ...c,
          effectiveScore: score,
          effectiveRec: rec
        };
      })
      .sort((a, b) => b.effectiveScore - a.effectiveScore);
  }, [candidates, historicalInterviews, selectedRole]);

  // Skill Distribution stats
  const skillDistributionData = [
    { role: 'GenAI Eng', open: 6, evaluated: 14, offered: 3 },
    { role: 'AI Architect', open: 4, evaluated: 10, offered: 2 },
    { role: 'Data Eng', open: 5, evaluated: 12, offered: 4 },
    { role: 'Full Stack', open: 8, evaluated: 18, offered: 5 },
    { role: 'DevOps', open: 5, evaluated: 11, offered: 3 },
  ];

  const handleApproveOffer = (candId: string, candName: string) => {
    updateCandidateStage(candId, 'Offer Extended');
    sendSlackNotification('offer_approval', { candidateName: candName });
    setActionSuccess(`Offer extended to ${candName} and notified in #hiring-pipeline!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const toggleCompare = (id: string) => {
    if (selectedCompareIds.includes(id)) {
      setSelectedCompareIds(selectedCompareIds.filter(item => item !== id));
    } else {
      if (selectedCompareIds.length >= 3) {
        alert('You can compare at most 3 candidates simultaneously.');
        return;
      }
      setSelectedCompareIds([...selectedCompareIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Action Notification */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button 
            onClick={() => setActiveView('slack')}
            className="text-xs text-emerald-700 underline font-bold"
          >
            Check Slack
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Briefcase size={18} />
            </span>
            <h1 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
              Hiring Manager Decision Portal
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate talent leaderboards, compare radar scorecards, and make one-click hiring decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCompareIds.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Layers size={15} />
              <span>Compare Selected ({selectedCompareIds.length})</span>
            </button>
          )}

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            aria-label="Filter by role"
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="All">All Open Requisitions</option>
            <option value="GenAI Engineer">GenAI Engineer (6 Open)</option>
            <option value="AI Architect">AI Architect (4 Open)</option>
            <option value="Data Engineer">Data Engineer (5 Open)</option>
            <option value="Full Stack Engineer">Full Stack Engineer (8 Open)</option>
            <option value="DevOps Engineer">DevOps Engineer (5 Open)</option>
          </select>
        </div>
      </div>

      {/* Offer Pipeline Board (4 Columns) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
          <FileCheck size={16} className="text-blue-600" />
          Active Offer & Decision Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Column 1: Ready for Decision */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <Clock size={13} /> Ready for Decision ({rankedCandidates.filter(c => c.effectiveRec === 'Strong Hire' || c.effectiveRec === 'Hire').length})
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {rankedCandidates.filter(c => c.effectiveRec === 'Strong Hire' || c.effectiveRec === 'Hire').slice(0, 4).map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                    <span className="text-xs font-bold text-emerald-700">{c.effectiveScore}%</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block">{c.role}</span>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <button
                      onClick={() => handleApproveOffer(c.id, c.name)}
                      className="w-full py-1 text-[11px] font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                    >
                      Approve Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Offer Extended */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Offer Extended (3)
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {[
                { name: "Dr. Elena Rostova", role: "GenAI Engineer", salary: "$225,000", days: "2 days ago" },
                { name: "Vikram Malhotra", role: "AI Architect", salary: "$280,000", days: "Yesterday" },
                { name: "Rajesh Kothari", role: "Data Engineer", salary: "$175,000", days: "Today" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                    <span className="text-[10px] text-emerald-800 font-bold px-1.5 py-0.5 rounded bg-emerald-100">Pending Sign</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block">{item.role}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-100">
                    <span>Pkg: <strong className="text-slate-800">{item.salary}</strong></span>
                    <span>{item.days}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Secondary Review / Borderline */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <AlertCircle size={13} /> Follow-up Panel Needed (2)
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {rankedCandidates.filter(c => c.effectiveRec === 'Borderline').slice(0, 3).map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                    <span className="text-xs font-bold text-amber-700">{c.effectiveScore}%</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block">{c.role}</span>
                  <button
                    onClick={() => alert(`Requested 30-min architectural leveling panel for ${c.name}.`)}
                    className="w-full py-1 text-[11px] font-semibold rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-all shadow-2xs"
                  >
                    Request Leveling Panel
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Requisition Rebalance */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <TrendingUp size={13} /> Requisition Demand
              </span>
            </div>
            <div className="space-y-2.5 text-xs">
              {skillDistributionData.map(stat => (
                <div key={stat.role} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 font-semibold">{stat.role}</span>
                    <span className="text-slate-500 font-medium">{stat.offered}/{stat.open} Filled</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${(stat.offered / stat.open) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-blue-800 text-center font-medium">
              Target Close Rate: <strong>85% by Q3</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Award size={16} className="text-blue-600" />
              Candidate Talent Leaderboard & Competency Rankings
            </h2>
            <p className="text-xs text-slate-500">Ranked by AI aggregate scorecard metrics across 5 technical competencies</p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Select checkboxes to compare candidates side-by-side
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-8">Compare</th>
                <th className="py-3 px-4 w-12">Rank</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Recommendation</th>
                <th className="py-3 px-4">Hiring Status</th>
                <th className="py-3 px-4 text-right">Quick Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedCandidates.map((cand, index) => {
                const isSelected = selectedCompareIds.includes(cand.id);

                return (
                  <tr key={cand.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCompare(cand.id)}
                        aria-label={`Select ${cand.name} for comparison`}
                        className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-500 font-mono">
                      #{index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={cand.avatarUrl} 
                          alt={cand.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{cand.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{cand.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">{cand.role}</td>
                    <td className="py-3.5 px-4 text-slate-500">{cand.experienceYears} Years</td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-extrabold text-slate-900">{cand.effectiveScore}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cand.effectiveRec === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        cand.effectiveRec === 'Hire' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        cand.effectiveRec === 'Borderline' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {cand.effectiveRec}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-medium">{cand.interviewStage}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {cand.interviewStage !== 'Offer Extended' ? (
                        <button
                          onClick={() => handleApproveOffer(cand.id, cand.name)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all"
                        >
                          Approve Offer
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold inline-flex items-center gap-1">
                          <Check size={13} /> Offered
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Modal */}
      {isCompareOpen && (
        <CandidateComparisonModal
          candidateIds={selectedCompareIds}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
};
