import React, { useState } from 'react';
import { ScoreBreakdown, Tier } from '../types/pricing';
import { Activity, AlertCircle, CheckCircle2, Download, Lock, Check, Globe, Code, Link } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { formatExportText } from '../systems/outputFormatter';

interface ScorePanelProps {
  score: ScoreBreakdown;
  notes: string[];
  tiers: Tier[];
  isPro: boolean;
  onUpgradeTrigger: () => void;
}

export function ScorePanel({ score, notes, tiers, isPro, onUpgradeTrigger }: ScorePanelProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();
  const { t, lang, setLang } = useLanguage();

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600';
    if (val >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBgColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const metrics = [
    { label: 'Simplicity', value: score.simplicity },
    { label: 'Upgrade Pressure', value: score.upgradePressure },
    { label: 'Margin Potential', value: score.marginPotential },
    { label: 'Differentiation', value: score.differentiation },
    { label: 'Market Fit', value: score.marketFit },
  ];

  // FEATURE 1: Human-readable Export
  const handleExportText = () => {
    if (!isPro) {
      onUpgradeTrigger();
      return;
    }
    
    const text = formatExportText(tiers, lang);
    
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    toast(t('ui.export.copied'), 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  // MUST-HAVE FEATURE 2: JSON Export
  const handleExportJson = () => {
    if (!isPro) {
      onUpgradeTrigger();
      return;
    }
    
    const json = JSON.stringify(tiers, null, 2);
    
    navigator.clipboard.writeText(json);
    setCopiedJson(true);
    toast('Copied JSON to clipboard', 'success');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyLink = () => {
    if (!isPro) {
      onUpgradeTrigger();
      return;
    }
    
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast('Shareable link copied to clipboard', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full xl:w-80 bg-white border-t xl:border-t-0 xl:border-l border-zinc-200 flex flex-col shrink-0 h-full">
      <div className="p-6 border-b border-zinc-200 shrink-0">
        <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-zinc-400" />
          Strategy Analysis
        </h2>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto">
        {/* Total Score */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-zinc-100 relative mb-2">
            <span className={`text-3xl font-bold tracking-tight ${getScoreColor(score.total)}`}>
              {score.total}
            </span>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="46" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                className={`${getScoreColor(score.total)} transition-all duration-1000 ease-out`}
                strokeDasharray={`${score.total * 2.89} 289`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-600">Confidence Score</p>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Breakdown</h3>
          {metrics.map(m => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-600">{m.label}</span>
                <span className="text-zinc-900">{m.value}/100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${getBgColor(m.value)}`} 
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Notes - IMPROVEMENT 2: Color-coded insights */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Insights</h3>
          <ul className="space-y-3">
            {notes.map((note, i) => {
              const isPositive = note.includes("balanced") || note.includes("positioned well");
              const isWarning = note.includes("too close") || note.includes("too cheap") || note.includes("too high");
              
              return (
                <li key={i} className={`flex items-start gap-2 text-sm p-3 rounded-lg border ${
                  isPositive ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
                  isWarning ? 'bg-amber-50 border-amber-100 text-amber-800' : 
                  'bg-zinc-50 border-zinc-100 text-zinc-700'
                }`}>
                  {isPositive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isWarning ? 'text-amber-500' : 'text-zinc-400'}`} />
                  )}
                  <span className="leading-relaxed">{note}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Export Preview (Monetization Optimization) */}
        <div className="space-y-3 mt-8">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{t('ui.export.preview')}</h3>
          <div className="relative rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
            <div className={`p-4 text-[10px] font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap ${!isPro ? 'blur-[3px] select-none opacity-50' : ''}`}>
              {formatExportText(tiers, lang)}
            </div>
            
            {!isPro && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
                <Lock className="w-5 h-5 text-amber-500 mb-2 drop-shadow-sm" />
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider drop-shadow-sm">{t('ui.export.proFeature')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Actions Footer */}
      <div className="p-6 border-t border-zinc-200 bg-zinc-50 shrink-0 flex flex-col gap-3">
        <div className="flex gap-2">
          <button 
            onClick={handleExportText}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg font-medium text-xs transition-all ${
              isPro 
                ? copiedText ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            {copiedText ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
            {copiedText ? t('ui.export.copied') : 'Text'}
            {!isPro && <Lock className="w-3 h-3 text-amber-500 ml-1" />}
          </button>

          <button 
            onClick={handleExportJson}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg font-medium text-xs transition-all ${
              isPro 
                ? copiedJson ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            {copiedJson ? <Check className="w-3 h-3" /> : <Code className="w-3 h-3" />}
            {copiedJson ? 'Copied' : 'JSON'}
            {!isPro && <Lock className="w-3 h-3 text-amber-500 ml-1" />}
          </button>
          
          <button 
            onClick={handleCopyLink}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg font-medium text-xs transition-all ${
              isPro 
                ? copiedLink ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            {copiedLink ? <Check className="w-3 h-3" /> : <Link className="w-3 h-3" />}
            {copiedLink ? 'Copied' : 'Link'}
            {!isPro && <Lock className="w-3 h-3 text-amber-500 ml-1" />}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-500">Language:</span>
          <div className="flex bg-zinc-200/50 p-0.5 rounded-md">
            {(['en', 'es', 'fr'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm transition-all ${
                  lang === l 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
