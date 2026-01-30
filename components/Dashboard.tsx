import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyzeChatLogs } from '../services/geminiService';
import { AnalysisData, MockChatLog } from '../types';

interface DashboardProps {
  onBack: () => void;
}

const INITIAL_LOGS: MockChatLog[] = [
  { id: '1', customer: 'Mario R.', timestamp: '10:05', message: 'My X-2000 won\'t turn on after the update.' },
  { id: '2', customer: 'Giulia V.', timestamp: '10:12', message: 'Fantastic service, thanks for solving it quickly!' },
  { id: '3', customer: 'Luca B.', timestamp: '10:30', message: 'Continuous E-500 error, the device is burning hot. I am worried.' },
  { id: '4', customer: 'Elena S.', timestamp: '11:05', message: 'I can\'t find the manual in Italian.' },
  { id: '5', customer: 'Paolo D.', timestamp: '11:45', message: 'I\'ve been waiting for a reply for 20 minutes, this is absurd.' },
  { id: '6', customer: 'Sara M.', timestamp: '12:10', message: 'The red LED is flashing, what does it mean?' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeChatLogs(INITIAL_LOGS);
      setData(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-textMuted hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Overview
        </button>
        <div className="flex items-center gap-3">
           <div className="bg-primary/10 p-2 rounded-lg">
             <TrendingUp size={20} className="text-primary" />
           </div>
           <h2 className="text-xl font-bold text-white">
            Analytics Intelligence
           </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Data Panel */}
        <div className="md:col-span-4 bg-surface border border-white/5 rounded-xl p-6 shadow-xl flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
               <FileText size={16} className="text-textMuted" /> Source Logs
             </h3>
             <span className="text-[10px] font-mono bg-surfaceHighlight px-2 py-1 rounded text-textMuted border border-white/5">{INITIAL_LOGS.length} RECORDS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {INITIAL_LOGS.map(log => (
              <div key={log.id} className="text-xs p-3 bg-surfaceHighlight/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between text-textMuted mb-1.5">
                  <span className="font-medium text-textMain">{log.customer}</span>
                  <span className="font-mono opacity-70">{log.timestamp}</span>
                </div>
                <p className="text-textMuted leading-relaxed">{log.message}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-6 w-full bg-white hover:bg-slate-200 text-black py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait shadow-lg hover:shadow-white/10"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="animate-spin" size={16} /> PROCESSING...
              </>
            ) : (
              <>
                <TrendingUp size={16} /> ANALYZE DATA
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-8 bg-surface border border-white/5 rounded-xl p-6 shadow-xl relative min-h-[500px]">
          {!data && !isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-textMuted">
               <div className="w-16 h-16 rounded-2xl bg-surfaceHighlight flex items-center justify-center mb-4 border border-white/5">
                 <TrendingUp size={32} className="opacity-40" />
               </div>
               <p className="text-sm">Initiate analysis to generate AI insights.</p>
            </div>
          )}

          {isAnalyzing && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-primary bg-surface/95 z-10 backdrop-blur-sm rounded-xl">
               <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="animate-pulse text-sm font-medium">Gemini is analyzing conversation patterns...</p>
             </div>
          )}

          {data && (
            <div className="h-full flex flex-col animate-fade-in-down space-y-6">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surfaceHighlight/30 p-5 rounded-xl border border-white/5">
                  <h4 className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-2">Sentiment Score</h4>
                  <div className="flex items-end gap-3">
                    <span className={`text-4xl font-bold tracking-tight ${data.sentimentScore > 60 ? 'text-success' : data.sentimentScore < 40 ? 'text-error' : 'text-warning'}`}>
                      {data.sentimentScore}
                    </span>
                    <span className="text-textMuted text-sm mb-1.5 font-medium">/ 100</span>
                  </div>
                  <div className="w-full bg-surfaceHighlight h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${data.sentimentScore > 60 ? 'bg-success' : data.sentimentScore < 40 ? 'bg-error' : 'bg-warning'}`} 
                      style={{ width: `${data.sentimentScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-surfaceHighlight/30 p-5 rounded-xl border border-white/5">
                  <h4 className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-2">Critical Issues</h4>
                  {data.urgentIssues.length > 0 ? (
                    <ul className="space-y-2 mt-1">
                      {data.urgentIssues.map((issue, i) => (
                        <li key={i} className="text-error text-xs font-medium flex items-start gap-2 bg-error/5 p-2 rounded">
                          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-success flex items-center gap-2 mt-3 text-sm font-medium">
                      <CheckCircle size={18} /> All systems nominal
                    </div>
                  )}
                </div>
              </div>

              {/* Charts & Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="bg-surfaceHighlight/30 p-5 rounded-xl border border-white/5 flex flex-col">
                  <h4 className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-4">Topic Distribution</h4>
                  <div className="flex-1 w-full min-h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topics} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} interval={0} dy={10} />
                        <YAxis tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                          cursor={{fill: '#262626', opacity: 0.4}}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-surfaceHighlight/30 p-5 rounded-xl border border-white/5">
                  <h4 className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-3">AI Executive Summary</h4>
                  <div className="relative">
                    <span className="absolute -top-1 -left-1 text-4xl text-white/5 font-serif">"</span>
                    <p className="text-sm text-textMain leading-relaxed pl-4 border-l-2 border-primary/30 py-1">
                      {data.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};