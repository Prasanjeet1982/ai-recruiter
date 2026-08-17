import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Layers, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  DollarSign 
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface CandidateComparisonModalProps {
  candidateIds: string[];
  onClose: () => void;
}

export const CandidateComparisonModal: React.FC<CandidateComparisonModalProps> = ({ candidateIds, onClose }) => {
  const { candidates, historicalInterviews, startInterview, setActiveView } = useApp();

  const selectedCandidates = candidates.filter(c => candidateIds.includes(c.id));

  // Build combined radar data
  const competencies = ['Technical Knowledge', 'Problem Solving', 'Communication', 'Architecture Skills', 'Coding Skills'];
  
  const radarData = competencies.map(comp => {
    const row: any = { subject: comp.split(' ')[0] };
    selectedCandidates.forEach((cand, idx) => {
      const hist = historicalInterviews.find(h => h.candidateId === cand.id);
      let score = 4;
      if (hist) {
        if (comp === 'Technical Knowledge') score = hist.competencyScores.technicalKnowledge;
        else if (comp === 'Problem Solving') score = hist.competencyScores.problemSolving;
        else if (comp === 'Communication') score = hist.competencyScores.communication;
        else if (comp === 'Architecture Skills') score = hist.competencyScores.architectureSkills;
        else if (comp === 'Coding Skills') score = hist.competencyScores.codingSkills;
      } else {
        score = Math.min(5, Math.max(2, Math.round(cand.experienceYears / 2.5)));
      }
      row[`Cand_${idx}`] = score;
    });
    return row;
  });

  const colors = ['#2563eb', '#059669', '#d97706'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Side-by-Side Candidate Competency Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Comparing {selectedCandidates.length} candidate evaluation dossiers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Radar Comparison Chart */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-blue-600" />
            Comparative Competency Polygon
          </span>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" stroke="#475569" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" tick={false} />
                {selectedCandidates.map((cand, idx) => (
                  <Radar
                    key={cand.id}
                    name={cand.name}
                    dataKey={`Cand_${idx}`}
                    stroke={colors[idx % colors.length]}
                    fill={colors[idx % colors.length]}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '11px', color: '#1e293b' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Candidate Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {selectedCandidates.map((cand, idx) => (
            <div key={cand.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={cand.avatarUrl} 
                    alt={cand.name}
                    className="w-10 h-10 rounded-full object-cover border-2" 
                    style={{ borderColor: colors[idx % colors.length] }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{cand.name}</h3>
                    <span className="text-[11px] text-blue-700 font-medium block">{cand.role}</span>
                    <span className="text-[10px] text-slate-500">{cand.experienceYears} Years Exp</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <GraduationCap size={12} className="text-indigo-600" />
                    <span className="truncate">{cand.education}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-emerald-600" />
                    <span>Target: <strong className="text-slate-800">{cand.targetSalary}</strong></span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Core Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {cand.skills.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  "{cand.resumeSummary}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    startInterview(cand.id);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Conduct AI Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
