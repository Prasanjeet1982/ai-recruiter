import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Hash, 
  Send, 
  Bot, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ChevronDown,
  Smile,
  Paperclip,
  Search,
  MoreVertical,
  Plus
} from 'lucide-react';

export const SlackPortal: React.FC = () => {
  const { slackMessages, sendSlackNotification, setActiveView, setDemoStep } = useApp();
  const [activeChannel, setActiveChannel] = useState<string>('interview-updates');
  const [messageInput, setMessageInput] = useState<string>('');

  const filteredMessages = slackMessages.filter(m => 
    activeChannel === 'all' || m.channel === activeChannel
  );

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendSlackNotification('offer_approval', {
      candidateName: messageInput
    });
    setMessageInput('');
  };

  const handleTriggerReminder = () => {
    sendSlackNotification('reminder', {
      candidateName: 'Carlos Delgado',
      interviewerName: 'Kavita Nair'
    });
  };

  const handleTriggerScheduled = () => {
    sendSlackNotification('scheduled', {
      candidateName: 'Hannah Schmidt',
      interviewerName: 'Marcus Sterling',
      date: 'Tomorrow',
      time: '3:00 PM EST'
    });
  };

  return (
    <div className="min-h-[85vh] bg-[#1a1d21] text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden border-t border-slate-800">
      
      {/* Slack Sidebar (Left) */}
      <div className="w-full md:w-64 bg-[#19171d] border-r border-[#2c3136] flex flex-col justify-between flex-shrink-0">
        
        {/* Workspace Header */}
        <div className="p-4 border-b border-[#2c3136] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#4A154B] flex items-center justify-center font-bold text-white text-xs font-heading">
              IQ
            </div>
            <div>
              <span className="font-bold text-sm text-white block">Enterprise Talent</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> AI Copilot Workspace
              </span>
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Channels List */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto">
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Channels
            </span>
            
            <button
              onClick={() => setActiveChannel('interview-updates')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeChannel === 'interview-updates'
                  ? 'bg-[#1164A3] text-white font-bold'
                  : 'text-slate-300 hover:bg-[#27242c] hover:text-white'
              }`}
            >
              <Hash size={14} />
              <span>interview-updates</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {slackMessages.filter(m => m.channel === 'interview-updates').length}
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('hiring-pipeline')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeChannel === 'hiring-pipeline'
                  ? 'bg-[#1164A3] text-white font-bold'
                  : 'text-slate-300 hover:bg-[#27242c] hover:text-white'
              }`}
            >
              <Hash size={14} />
              <span>hiring-pipeline</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {slackMessages.filter(m => m.channel === 'hiring-pipeline').length}
              </span>
            </button>
          </div>

          {/* Quick Simulation Triggers */}
          <div className="p-3 rounded-lg bg-[#222529] border border-[#33383f] space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Simulate Notifications:
            </span>
            <button
              onClick={handleTriggerReminder}
              className="w-full text-left px-2 py-1 rounded bg-[#2c3136] hover:bg-[#383e44] text-[11px] text-amber-300 font-medium transition-all flex items-center gap-1.5"
            >
              <Clock size={12} />
              <span>Dispatch Feedback Reminder</span>
            </button>
            <button
              onClick={handleTriggerScheduled}
              className="w-full text-left px-2 py-1 rounded bg-[#2c3136] hover:bg-[#383e44] text-[11px] text-blue-300 font-medium transition-all flex items-center gap-1.5"
            >
              <Bell size={12} />
              <span>Dispatch Schedule Alert</span>
            </button>
          </div>
        </div>

        {/* Back to Platform footer */}
        <div className="p-3 border-t border-[#2c3136]">
          <button
            onClick={() => setActiveView('recruiter')}
            className="w-full py-1.5 px-3 rounded-lg bg-[#27242c] hover:bg-[#332f3a] text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 border border-[#3f3b46]"
          >
            <ArrowLeft size={13} />
            <span>Return to Recruiter View</span>
          </button>
        </div>
      </div>

      {/* Main Slack Feed (Right) */}
      <div className="flex-1 flex flex-col justify-between bg-[#1a1d21]">
        
        {/* Channel Header */}
        <div className="p-3.5 border-b border-[#2c3136] flex items-center justify-between bg-[#1a1d21]">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-slate-400" />
            <div>
              <span className="font-bold text-sm text-white block">#{activeChannel}</span>
              <span className="text-[11px] text-slate-400">
                Automated AI Interview Copilot alerts, interviewer reminders, and hiring approvals
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Slack Connect &bull; Online
            </span>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group hover:bg-[#222529] p-3 rounded-xl transition-colors">
              <img 
                src={msg.sender.avatar} 
                alt={msg.sender.name}
                className="w-10 h-10 rounded-lg object-cover border border-[#33383f]" 
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{msg.sender.name}</span>
                  {msg.sender.isBot && (
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      APP
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {/* Message Text / Blocks */}
                {msg.blocks ? (
                  <div className="p-3.5 rounded-xl bg-[#222529] border border-[#383e44] space-y-2.5 max-w-2xl">
                    {msg.blocks.map((block, bIdx) => {
                      if (block.type === 'header') {
                        return (
                          <h4 key={bIdx} className="font-bold text-sm text-white flex items-center gap-1.5">
                            {block.text}
                          </h4>
                        );
                      }
                      if (block.type === 'section' && block.fields) {
                        return (
                          <div key={bIdx} className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-[#33383f]">
                            {block.fields.map((field, fIdx) => (
                              <div key={fIdx} dangerouslySetInnerHTML={{ __html: field.replace(/\*(.*?)\*/g, '<strong class="text-white">$1</strong>') }} />
                            ))}
                          </div>
                        );
                      }
                      if (block.type === 'context') {
                        return (
                          <p key={bIdx} className="text-xs text-slate-400 italic pt-1 border-t border-[#33383f]">
                            {block.text}
                          </p>
                        );
                      }
                      if (block.type === 'actions' && block.buttons) {
                        return (
                          <div key={bIdx} className="flex items-center gap-2 pt-2 border-t border-[#33383f]">
                            {block.buttons.map((btn, btnIdx) => (
                              <button
                                key={btnIdx}
                                onClick={() => {
                                  if (btn.action === 'view_scorecard') {
                                    setActiveView('scorecard');
                                  } else {
                                    setActiveView('workday');
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                  btn.style === 'primary'
                                    ? 'bg-[#007a5a] hover:bg-[#148567] text-white shadow'
                                    : 'bg-[#2c3136] hover:bg-[#383e44] text-slate-200 border border-[#444a52]'
                                }`}
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p key={bIdx} className="text-xs text-slate-200">
                          {block.text}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-200">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#2c3136] bg-[#1a1d21]">
          <form onSubmit={handleSendCustomMessage} className="p-2 rounded-xl bg-[#222529] border border-[#383e44] focus-within:border-blue-500">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="w-full bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[#2c3136] text-slate-400">
              <div className="flex items-center gap-2 text-xs">
                <Smile size={15} className="cursor-pointer hover:text-white" />
                <Paperclip size={15} className="cursor-pointer hover:text-white" />
              </div>
              <button 
                type="submit"
                className="p-1.5 rounded-lg bg-[#007a5a] hover:bg-[#148567] text-white"
              >
                <Send size={13} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
