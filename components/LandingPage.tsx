import React from 'react';
import { Play, LineChart, Github, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
       {/* Subtle Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] -z-10 pointer-events-none"></div>

      <header className="text-center py-20 px-5 animate-fade-in-down">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wide text-primary border border-primary/20 rounded-full bg-primary/5 uppercase">
          Case Study Showcase
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          AI Customer Care <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Automation</span>
        </h1>
        <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
          How we revolutionized customer support and data analysis using <span className="text-white font-semibold">n8n</span> and <span className="text-white font-semibold">Gemini AI</span>.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: FRONT-END */}
        <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
             <Play size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-primary uppercase mb-2 block">The Assistant</span>
              <h2 className="text-3xl font-bold text-white mb-4">AI Support Agent</h2>
              <p className="text-textMuted leading-relaxed mb-6">
                An intelligent bot that learns from PDF manuals to answer technical queries instantly, 24/7.
              </p>
            </div>

            <div className="mt-auto space-y-4">
               <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                  <div className="flex items-start gap-3">
                    <span className="text-warning mt-1 text-lg">⚠️</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Problem</h4>
                      <p className="text-xs text-textMuted mt-1">Repetitive technical questions overwhelming the support team.</p>
                    </div>
                  </div>
               </div>

               <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">🤖</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Solution</h4>
                      <p className="text-xs text-textMuted mt-1">Gemini AI parses documentation to provide accurate, instant answers.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* CARD 2: BACK-END */}
        <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-secondary/50 transition-all duration-300 group relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
             <LineChart size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
             <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-secondary uppercase mb-2 block">The Analyst</span>
              <h2 className="text-3xl font-bold text-white mb-4">Automated Intelligence</h2>
              <p className="text-textMuted leading-relaxed mb-6">
                A backend system that audits conversation quality and generates business insights automatically.
              </p>
            </div>

            <div className="mt-auto space-y-4">
               <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                  <div className="flex items-start gap-3">
                    <span className="text-warning mt-1 text-lg">⚠️</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Problem</h4>
                      <p className="text-xs text-textMuted mt-1">Unstructured chat data making trend analysis impossible.</p>
                    </div>
                  </div>
               </div>

               <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                  <div className="flex items-start gap-3">
                    <span className="text-secondary mt-1 text-lg">📊</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Solution</h4>
                      <p className="text-xs text-textMuted mt-1">Automated "Critic" AI that tags, scores, and visualizes data.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Button */}
      <div className="text-center pb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <a 
          href="https://github.com/Carly97-chu/n8n-Automations/blob/057a36b25436d4901d17f0a9914fc385fddbea7a/Customer%20Support%26Care%20(5).json" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-black text-sm font-bold hover:bg-slate-200 transition-all duration-200 shadow-lg hover:shadow-white/10 group"
        >
          <Github size={20} /> 
          <span>VIEW PROJECT ON GITHUB</span>
          <ExternalLink size={14} className="opacity-50 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

    </div>
  );
};