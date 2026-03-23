import React, { useState, useEffect } from 'react';
import { PricingInput } from '../types/pricing';
import { Settings2, Target, Box, DollarSign, Layers, Zap, Lock, RotateCcw, Sparkles } from 'lucide-react';

interface SidebarInputsProps {
  input: PricingInput;
  onChange: (input: PricingInput) => void;
  isPro: boolean;
  onUpgradeTrigger: () => void;
}

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

export function SidebarInputs({ input, onChange, isPro, onUpgradeTrigger }: SidebarInputsProps) {
  const [localBasePrice, setLocalBasePrice] = useState(input.basePrice.toString());

  // Sync local state when external input changes (e.g., loading a project)
  useEffect(() => {
    setLocalBasePrice(input.basePrice.toString());
  }, [input.basePrice]);

  const handleChange = (field: keyof PricingInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  const handleBasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalBasePrice(val);
    
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 0) {
      handleChange('basePrice', parsed);
    }
  };

  const handleBasePriceBlur = () => {
    const parsed = parseInt(localBasePrice);
    if (isNaN(parsed) || parsed < 1) {
      setLocalBasePrice('1');
      handleChange('basePrice', 1);
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_INPUT);
  };

  return (
    <div className="w-80 bg-white border-r border-zinc-200 h-screen overflow-y-auto flex flex-col shrink-0 relative">
      <div className="p-6 border-b border-zinc-200 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-zinc-900 tracking-tight">PricingTier Builder</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Product Type */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Box className="w-4 h-4 text-zinc-400" />
            Product Type
          </label>
          <select 
            value={input.productType}
            onChange={(e) => handleChange('productType', e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          >
            <option value="saas_b2b">B2B SaaS</option>
            <option value="creator">Creator Tool</option>
            <option value="agency">Agency Service</option>
            <option value="dev_tool">Developer Tool</option>
            <option value="local_biz">Local Business Software</option>
          </select>
        </div>

        {/* Target Market */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Target className="w-4 h-4 text-zinc-400" />
            Target Market
          </label>
          <select 
            value={input.targetMarket}
            onChange={(e) => handleChange('targetMarket', e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
          >
            <option value="indie">Indie Hackers / Solo</option>
            <option value="smb">SMBs</option>
            <option value="enterprise">Enterprise</option>
            <option value="creators">Creators</option>
            <option value="agencies">Agencies</option>
          </select>
        </div>

        {/* Base Price */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <DollarSign className="w-4 h-4 text-zinc-400" />
            Base Price (Entry Tier)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input 
              type="number" 
              min="1"
              value={localBasePrice}
              onChange={handleBasePriceChange}
              onBlur={handleBasePriceBlur}
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Spacing Mode */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Settings2 className="w-4 h-4 text-zinc-400" />
            Price Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['conservative', 'geometric', 'aggressive'] as const).map((mode) => {
              const isLocked = mode === 'aggressive' && !isPro;
              return (
                <button
                  key={mode}
                  onClick={() => isLocked ? onUpgradeTrigger() : handleChange('spacingMode', mode)}
                  className={`py-2 px-1 text-xs font-medium rounded-md border transition-all flex items-center justify-center gap-1 ${
                    input.spacingMode === mode 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Zap className="w-4 h-4 text-zinc-400" />
              Total Features
            </label>
            <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">{input.featureCount}</span>
          </div>
          <input 
            type="range" 
            min="3" max="20" 
            value={input.featureCount}
            onChange={(e) => handleChange('featureCount', parseInt(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        {/* Premium Emphasis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Target className="w-4 h-4 text-zinc-400" />
              Premium Exclusivity
            </label>
            <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">{input.premiumEmphasis}/10</span>
          </div>
          <input 
            type="range" 
            min="1" max="10" 
            value={input.premiumEmphasis}
            onChange={(e) => handleChange('premiumEmphasis', parseInt(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <p className="text-xs text-zinc-500 leading-relaxed">
            Higher values push more features exclusively to the Premium tier.
          </p>
        </div>

        {/* Pricing Psychology */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pricing Psychology</h3>
          
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">Charm Pricing (.99)</span>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${input.charmPricing ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={input.charmPricing}
                onChange={(e) => handleChange('charmPricing', e.target.checked)}
              />
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${input.charmPricing ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Annual Discount</label>
              <span className="text-xs font-mono bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">{input.annualDiscount}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="50" step="5"
              value={input.annualDiscount}
              onChange={(e) => handleChange('annualDiscount', parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
        
        {/* Reset Button */}
        <div className="pt-4 border-t border-zinc-200">
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Monetization Banner */}
      {!isPro && (
        <div className="p-4 bg-zinc-900 text-white shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Unlock Pro Features</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-3 leading-relaxed">
                Get JSON exports, aggressive spacing, and unlimited history.
              </p>
              <button 
                onClick={onUpgradeTrigger}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-xs font-bold transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
