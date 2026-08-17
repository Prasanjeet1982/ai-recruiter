import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  UserCheck, 
  Sparkles, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface ScheduleInterviewModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ candidate, onClose }) => {
  const { interviewers, scheduleInterview, sendSlackNotification } = useApp();

  const [selectedInterviewerId, setSelectedInterviewerId] = useState<string>(
    candidate.assignedInterviewerId || interviewers[0].id
  );
  const [date, setDate] = useState<string>('2026-08-20');
  const [time, setTime] = useState<string>('14:00');
  const [focusArea, setFocusArea] = useState<string>('Standard Technical & Architecture Mix');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInterview(candidate.id, selectedInterviewerId, date, time);
    setIsScheduled(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl p-6 space-y-5 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={18} />
            <h2 className="text-sm font-bold text-slate-900 font-heading">
              Schedule AI-Powered Interview
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200">
            <X size={16} />
          </button>
        </div>

        {isScheduled ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900 font-heading">Interview Scheduled Successfully!</h3>
            <p className="text-xs text-slate-500 font-medium">
              Calendar invite and Slack alerts dispatched to candidate and evaluator.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
            
            {/* Candidate Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img 
                src={candidate.avatarUrl} 
                alt={candidate.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200" 
              />
              <div>
                <span className="font-bold text-slate-900 block">{candidate.name}</span>
                <span className="text-[11px] text-blue-700 font-semibold">{candidate.role} &bull; {candidate.experienceYears} Years Experience</span>
              </div>
            </div>

            {/* Select Interviewer */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Assigned Technical Interviewer:</label>
              <select
                value={selectedInterviewerId}
                onChange={(e) => setSelectedInterviewerId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-medium"
              >
                {interviewers.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} &mdash; {inv.title} ({inv.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Time Slot:</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-medium"
                />
              </div>
            </div>

            {/* Focus Question Preset */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Assessment Question Focus Area:</label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 text-xs font-medium"
              >
                <option value="Standard Technical & Architecture Mix">Standard Technical & Architecture Mix (4 MCQ, 4 Subj, 2 Scenario)</option>
                <option value="Advanced Systems & Distributed Scale">Advanced Systems & Distributed Scale</option>
                <option value="Hands-on Code & Algorithm Deep Dive">Hands-on Code & Algorithm Deep Dive</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
              >
                Confirm & Dispatch Invites
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
