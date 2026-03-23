import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { PricingInput, PricingOutput, PricingProject } from './types/pricing';
import { runEngine } from './systems/coreEngine';
import { SidebarInputs } from './components/SidebarInputs';
import { TierWorkspace } from './components/TierWorkspace';
import { ScorePanel } from './components/ScorePanel';
import { HistoryPanel } from './components/HistoryPanel';
import { UpgradeModal } from './components/UpgradeModal';
import { checkProStatus } from './systems/monetizationManager';
import { ToastProvider } from './hooks/useToast';
import { ToastContainer } from './components/ui/ToastContainer';

const DEFAULT_INPUT: PricingInput = {
  productType: 'saas_b2b',
  targetMarket: 'smb',
  basePrice: 29,
  spacingMode: 'geometric',
  featureCount: 12,
  premiumEmphasis: 5,
  annualDiscount: 20,
  charmPricing: false
};

export default function App() {
  const [input, setInput] = useState<PricingInput>(() => {
    try {
      if (window.location.hash) {
        const decoded = JSON.parse(atob(window.location.hash.slice(1)));
        return { ...DEFAULT_INPUT, ...decoded }; // Merge to ensure all fields exist
      }
    } catch (e) {
      console.error("Failed to parse URL hash", e);
    }
    return DEFAULT_INPUT;
  });

  const deferredInput = useDeferredValue(input);
  
  const [isPro, setIsPro] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setIsPro(checkProStatus());
  }, []);

  // Update URL hash when input changes
  useEffect(() => {
    const encoded = btoa(JSON.stringify(deferredInput));
    window.history.replaceState(null, '', `#${encoded}`);
  }, [deferredInput]);

  const output = useMemo<PricingOutput>(() => runEngine(deferredInput, isPro), [deferredInput, isPro]);

  const currentProject: PricingProject = {
    id: 'current',
    name: 'Draft',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    input: deferredInput,
    output
  };

  const handleLoadProject = (project: PricingProject) => {
    setInput(project.input);
  };

  return (
    <ToastProvider>
      <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-900">
        {/* Left Sidebar - Fixed */}
        <SidebarInputs 
          input={input} 
          onChange={setInput} 
          isPro={isPro} 
          onUpgradeTrigger={() => setShowUpgrade(true)} 
        />
        
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col xl:flex-row relative">
          <div className="flex-1 flex flex-col min-h-full">
            <TierWorkspace 
              tiers={output.tiers} 
              currentProject={currentProject} 
              isPro={isPro} 
              onUpgradeTrigger={() => setShowUpgrade(true)} 
              onOpenHistory={() => setShowHistory(true)}
            />
          </div>
          <ScorePanel 
            score={output.score} 
            notes={output.notes} 
            tiers={output.tiers}
            isPro={isPro}
            onUpgradeTrigger={() => setShowUpgrade(true)}
          />
        </div>

        <HistoryPanel 
          isOpen={showHistory} 
          onClose={() => setShowHistory(false)} 
          currentProject={currentProject} 
          onLoadProject={handleLoadProject} 
        />
        
        {showUpgrade && (
          <UpgradeModal 
            onClose={() => setShowUpgrade(false)} 
            onUnlock={() => {
              setIsPro(true);
              setShowUpgrade(false);
            }} 
          />
        )}
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
