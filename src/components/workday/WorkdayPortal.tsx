import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  Search, 
  FileText, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const WorkdayPortal: React.FC = () => {
  const { workdayRecords, candidates, historicalInterviews, setActiveView } = useApp();
  const [selectedReq, setSelectedReq] = useState<string>('REQ-2026-084');
  const [activeTab, setActiveTab] = useState<'candidates' | 'scorecards' | 'requisition'>('scorecards');

  return (
    <div className="min-h-[85vh] bg-[#0c182b] text-slate-100 font-sans">
      
      {/* Workday Classic Header */}
      <div className="bg-[#003b71] border-b border-[#00519e] px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-bold text-[#003b71] text-lg font-heading shadow">
              W
            </div>
            <div>
              <span className="font-heading font-extrabold text-white text-base tracking-tight block">
                workday. <span className="font-normal text-xs text-blue-200 uppercase tracking-widest">Recruiting HCM</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[#002d57] px-3 py-1.5 rounded-lg border border-[#004f98] text-xs">
            <Search size={13} className="text-blue-300" />
            <input 
              type="text" 
              defaultValue="REQ-2026-084: Lead GenAI Engineer" 
              className="bg-transparent border-none text-white focus:outline-none text-xs w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#00284d] px-3 py-1.5 rounded-lg text-xs border border-[#004f98]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-blue-100 font-medium">Enterprise Sync: Active</span>
          </div>
          <button
            onClick={() => setActiveView('recruiter')}
            className="flex items-center gap-1 text-xs text-blue-200 hover:text-white px-2.5 py-1 rounded bg-[#004b8f]"
          >
            <ArrowLeft size={13} /> Return to Copilot
          </button>
        </div>
      </div>

      {/* Workday Sub-Header (Job Requisition Overview) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Requisition Banner Card */}
        <div className="p-6 rounded-xl bg-[#112442] border border-[#1d3d6e] shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-bold font-mono">
                  REQ-2026-084
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Open &bull; Priority Requisition
                </span>
              </div>
              <h1 className="text-xl font-heading font-bold text-white mt-1">
                Lead Generative AI Engineer &mdash; Applied AI Research
              </h1>
              <p className="text-xs text-slate-300">
                Hiring Manager: <strong>Dr. Arthur Vance</strong> &bull; Primary Evaluator: <strong>Sarah Jenkins</strong> &bull; Target Start: Sept 2026
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-[#003463] border border-[#00519e] text-right">
                <span className="text-[10px] uppercase font-bold text-blue-300 block">Total Pipeline</span>
                <span className="text-lg font-bold text-white">14 Candidates</span>
              </div>
              <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Workday Synced</span>
                <span className="text-lg font-bold text-emerald-300">{workdayRecords.length} Scorecards</span>
              </div>
            </div>
          </div>

          {/* Workday Portal Navigation Tabs */}
          <div className="flex space-x-2 border-t border-[#1d3d6e] pt-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scorecards')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'scorecards'
                  ? 'bg-[#00519e] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a3661]'
              }`}
            >
              Interview Scorecards & Assessments ({workdayRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'candidates'
                  ? 'bg-[#00519e] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a3661]'
              }`}
            >
              Candidate Pipeline (14)
            </button>
            <button
              onClick={() => setActiveTab('requisition')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeTab === 'requisition'
                  ? 'bg-[#00519e] text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a3661]'
              }`}
            >
              Job Details & Compensation Band
            </button>
          </div>
        </div>

        {/* Workday Scorecards Tab View */}
        {activeTab === 'scorecards' && (
          <div className="space-y-4">
            
            {/* Live Success Banner */}
            <div className="p-4 rounded-xl bg-[#0a3118] border border-[#1b6b37] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs block text-emerald-200">
                    Workday Recruiting &bull; AI Interview Scorecards Synchronized
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    Interviewer feedback submitted via AI Interview Copilot is automatically validated and archived in Workday HCM.
                  </span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold bg-[#144f2b] px-2.5 py-1 rounded text-emerald-200">
                AUDIT LOGGED
              </span>
            </div>

            {/* Scorecards Table */}
            <div className="rounded-xl bg-[#112442] border border-[#1d3d6e] overflow-hidden shadow">
              <div className="p-4 border-b border-[#1d3d6e] flex items-center justify-between">
                <span className="font-bold text-xs text-white">
                  Submitted Evaluation Scorecards ({workdayRecords.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Data source: Local JSON Mock Workday Data Store
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#1d3d6e] bg-[#0d1c33] text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                      <th className="py-3 px-4">Scorecard ID</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Job Title / Req</th>
                      <th className="py-3 px-4">Evaluator</th>
                      <th className="py-3 px-4">Rating / Score</th>
                      <th className="py-3 px-4">Recommendation</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d3d6e]/60 text-slate-200">
                    {workdayRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#162e54] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-blue-300 font-bold">{rec.id}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{rec.candidateName}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.jobTitle}</td>
                        <td className="py-3.5 px-4 text-slate-300">{rec.submittedBy}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{rec.overallRating}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rec.recommendation === 'Strong Hire' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            rec.recommendation === 'Hire' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {rec.recommendation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> {rec.scorecardStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(rec.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scorecard Detailed Highlights Preview */}
            <div className="p-5 rounded-xl bg-[#112442] border border-[#1d3d6e] space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FileText size={15} className="text-blue-300" />
                Latest Synchronized Assessment Transcript & Notes
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0c1a2e] p-3.5 rounded-lg border border-[#1a3763]">
                "{workdayRecords[0]?.notes || 'Demonstrated outstanding technical competence across LLM inference architecture, PagedAttention KV-cache management, and fine-tuning parameters.'}"
              </p>
            </div>
          </div>
        )}

        {/* Candidate Pipeline Tab View */}
        {activeTab === 'candidates' && (
          <div className="rounded-xl bg-[#112442] border border-[#1d3d6e] p-5 space-y-3">
            <span className="font-bold text-xs text-white block">Requisition Candidate Roster</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidates.slice(0, 6).map(cand => (
                <div key={cand.id} className="p-3.5 rounded-lg bg-[#0d1c33] border border-[#1d3d6e] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{cand.name}</span>
                    <span className="text-[10px] text-blue-300 px-1.5 py-0.5 rounded bg-blue-900/50">{cand.interviewStage}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">{cand.role} &bull; {cand.experienceYears} Yrs</span>
                  <p className="text-[10px] text-slate-400 truncate">{cand.skills.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requisition Details Tab View */}
        {activeTab === 'requisition' && (
          <div className="rounded-xl bg-[#112442] border border-[#1d3d6e] p-5 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm">Role Specifications & Target Profile</h3>
            <p>Target Base Salary: <strong>$210,000 &mdash; $240,000 USD</strong></p>
            <p>Equity Band: <strong>0.15% &mdash; 0.25% RSU</strong></p>
            <p>Location: <strong>San Francisco, CA (Hybrid 3 Days Onsite)</strong></p>
            <p>Minimum Experience: <strong>5+ Years in Machine Learning / NLP / Distributed Systems</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};
