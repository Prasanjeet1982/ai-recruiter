import React from 'react';
import { Candidate, Interviewer } from '../../types';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  Award,
  Shield
} from 'lucide-react';

interface CandidateDossierProps {
  candidate: Candidate;
  interviewer: Interviewer;
}

export const CandidateDossier: React.FC<CandidateDossierProps> = ({ candidate, interviewer }) => {
  return (
    <div className="space-y-4 text-xs">
      
      {/* Profile Header Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <img 
            src={candidate.avatarUrl} 
            alt={candidate.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500 shadow-xs"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">{candidate.name}</h3>
            <span className="text-blue-700 font-semibold block text-[11px]">{candidate.role}</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin size={10} /> {candidate.location}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <GraduationCap size={13} className="text-indigo-600 flex-shrink-0" />
            <span className="truncate font-medium" title={candidate.education}>{candidate.education.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <DollarSign size={13} className="text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800">{candidate.targetSalary.split(' - ')[0]}+</span>
          </div>
        </div>
      </div>

      {/* AI Resume Summary */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <FileText size={13} className="text-blue-600" />
            Resume Synopsis
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            Parsed
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          {candidate.resumeSummary}
        </p>
      </div>

      {/* Verified Core Skills */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
        <span className="font-bold text-slate-800 flex items-center gap-1.5">
          <Award size={13} className="text-blue-600" />
          Core Stack Competencies
        </span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {candidate.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-md bg-blue-50 text-blue-800 text-[10px] font-semibold border border-blue-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Interviewer Context */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
          Assigned Interviewer
        </span>
        <div className="flex items-center gap-2.5">
          <img 
            src={interviewer.avatarUrl} 
            alt={interviewer.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-300" 
          />
          <div>
            <span className="font-bold text-slate-900 text-[11px] block">{interviewer.name}</span>
            <span className="text-[10px] text-slate-600">{interviewer.title} &bull; {interviewer.department}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
