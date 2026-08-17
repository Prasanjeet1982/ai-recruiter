import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Activity } from 'lucide-react';

interface AudioVisualizerProps {
  isListening?: boolean;
  transcriptText?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isListening = true,
  transcriptText = "Candidate is responding..."
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!transcriptText) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    let i = 0;
    setDisplayedText('');
    
    // Simulate real-time streaming speech-to-text token typing
    const interval = setInterval(() => {
      if (i < transcriptText.length) {
        setDisplayedText(prev => prev + transcriptText.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [transcriptText]);

  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
            <Activity size={13} className="text-blue-600" />
            Live Voice Transcription & Audio Stream
          </span>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="flex items-center gap-1 h-5 px-2 bg-white rounded-md border border-slate-200 shadow-2xs">
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="waveform-bar"></span>
          <span className="text-[10px] text-blue-700 font-mono font-bold ml-1.5">HD Audio</span>
        </div>
      </div>

      {/* Live Transcript Box */}
      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 min-h-[48px] flex items-start gap-2 shadow-2xs">
        <Volume2 size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Candidate Speech-to-Text:</span>
          <p className="font-mono text-[11px] text-slate-800 leading-relaxed font-medium">
            "{displayedText || 'Awaiting candidate oral response...'}"
            {isTyping && <span className="inline-block w-1.5 h-3 bg-blue-600 ml-1 animate-pulse"></span>}
          </p>
        </div>
      </div>
    </div>
  );
};
