import React, { useEffect, useState } from 'react';
import { Tier, PricingProject } from '../types/pricing';
import { Check, Save, FolderOpen } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { saveProject } from '../systems/storageManager';
import { ComparisonTable } from './ComparisonTable';

interface TierWorkspaceProps {
  tiers: Tier[];
  currentProject: PricingProject;
  isPro: boolean;
  onUpgradeTrigger: () => void;
  onOpenHistory: () => void;
}

// Sub-component for price to handle flash animation
function PriceDisplay({ price, isAnnual }: { price: number, isAnnual: boolean }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 300);
    return () => clearTimeout(t);
  }, [price, isAnnual]);

  return (
    <span className={`text-4xl font-bold tracking-tight transition-colors duration-300 ${flash ? 'text-emerald-500' : 'text-zinc-900'}`}>
      ${price}
    </span>
  );
}

export function TierWorkspace({ tiers, currentProject, isPro, onUpgradeTrigger, onOpenHistory }: TierWorkspaceProps) {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [lastSavedHash, setLastSavedHash] = useState<string>('');
  
  const currentHash = JSON.stringify(currentProject.input);
  const isDirty = lastSavedHash !== currentHash;

  const handleQuickSave = () => {
    const newProject = {
      ...currentProject,
      id: Date.now().toString(),
      name: `Draft - ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const success = saveProject(newProject);
    if (success) {
      setLastSavedHash(currentHash);
      toast('Draft saved to history.', 'success');
    } else {
      toast('Failed to save draft. Storage full.', 'error');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleQuickSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject, currentHash]);

  return (
    <div className="flex-1 bg-zinc-50/50 flex flex-col min-h-full">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Workspace</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {isDirty ? 'Unsaved Draft' : 'All Changes Saved'}
            </span>
          </div>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center bg-zinc-200/50 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${billingCycle === 'monthly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Annual
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Save {currentProject.input.annualDiscount}%</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-lg shadow-sm hover:bg-zinc-50 font-medium text-sm transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            History
          </button>
          <button 
            onClick={handleQuickSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 font-medium text-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Tiers Container */}
      <div className="p-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 items-stretch">
            {tiers.map((tier, index) => {
              const isProTier = tier.emphasis === 'core';
              const displayPrice = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceAnnual;
              
              return (
                <div 
                  key={tier.name}
                  className={`relative rounded-2xl bg-white p-8 transition-all duration-300 flex flex-col w-full sm:w-[320px] shrink-0 ${
                    isProTier 
                      ? 'ring-2 ring-emerald-500 shadow-2xl shadow-emerald-500/10 scale-100 lg:scale-105 z-10' 
                      : 'border border-zinc-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isProTier && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900">{tier.name}</h3>
                    <div className="mt-4 flex items-baseline text-zinc-900">
                      <PriceDisplay price={displayPrice} isAnnual={billingCycle === 'annual'} />
                      <span className="ml-1 text-sm font-medium text-zinc-500">/mo</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-zinc-500 mt-1">Billed ${displayPrice * 12} yearly</p>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    <p className="text-sm font-medium text-zinc-900">Includes:</p>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => {
                        const isExclusive = feature.includes('(Premium Only)');
                        const displayName = feature.replace(' (Premium Only)', '');
                        
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 shrink-0 ${isExclusive ? 'text-amber-500' : 'text-emerald-500'}`} />
                            <span className={`text-sm ${isExclusive ? 'font-medium text-zinc-900' : 'text-zinc-600'}`}>
                              {displayName}
                              {isExclusive && <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">Exclusive</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <button className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors mt-auto ${
                    isProTier 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm' 
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                  }`}>
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>

          {/* Comparison Table (Must-Have Feature 2) */}
          <ComparisonTable tiers={tiers} />
        </div>
      </div>
    </div>
  );
}
