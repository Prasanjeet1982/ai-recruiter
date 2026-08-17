import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  FileCheck, 
  Award,
  ArrowRight
} from 'lucide-react';

interface WorkdaySyncModalProps {
  candidateName: string;
  role: string;
  score: number;
  recommendation: string;
  onClose: () => void;
}

export const WorkdaySyncModal: React.FC<WorkdaySyncModalProps> = ({
  candidateName,
  role,
  score,
  recommendation,
  onClose
}) => {
  const { setActiveView } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        
        {/* Workday Classic Header */}
        <div className="bg-[#003b71] px-5 py-3.5 flex items-center justify-between border-b border-[#00519e]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center font-bold text-[#003b71] text-xs">
              W
            </div>
            <span className="font-heading font-bold text-white text-sm">
              Workday Recruiting Integration
            </span>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 size={26} />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-base font-heading font-bold text-slate-900">
              Interview Feedback Submitted Successfully
            </h3>
            <p className="text-slate-600 font-medium">
              The AI evaluation scorecard has been synchronized to Workday HCM for candidate <strong className="text-slate-900">{candidateName}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Job Requisition:</span>
              <span className="text-blue-700 font-mono font-bold">REQ-2026-084</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Position:</span>
              <span className="text-slate-900 font-semibold">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Scorecard Rating:</span>
              <span className="text-slate-900 font-bold">{score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Hiring Outcome:</span>
              <span className="text-emerald-700 font-bold">{recommendation}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all text-xs"
            >
              Done
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveView('workday');
              }}
              className="flex-1 py-2 rounded-lg bg-[#003b71] hover:bg-[#004f98] text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View in Workday</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
