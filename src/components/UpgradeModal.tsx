import React, { useState } from 'react';
import { X, Sparkles, Check, Key } from 'lucide-react';
import { unlockPro } from '../systems/monetizationManager';
import { useToast } from '../hooks/useToast';

interface UpgradeModalProps {
  onClose: () => void;
  onUnlock: () => void;
}

export function UpgradeModal({ onClose, onUnlock }: UpgradeModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const { toast } = useToast();

  const handlePurchase = () => {
    // In a real app, this would redirect to Stripe.
    // For this zero-backend micro-SaaS, we simulate the unlock locally.
    window.open('https://example.com/buy', '_blank');
  };

  const handleUnlock = () => {
    if (!licenseKey.trim()) {
      toast('Please enter a license key.', 'warning');
      return;
    }
    
    const success = unlockPro(licenseKey);
    if (success) {
      toast('Pro features unlocked successfully!', 'success');
      onUnlock();
    } else {
      toast('Invalid or malformed license key.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center border-b border-zinc-100 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Unlock Pro</h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Get access to advanced pricing tools and export your strategy instantly.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <ul className="space-y-4">
            {[
              'Aggressive Price Spacing Mode',
              'One-click Markdown Export',
              'Unlimited Saved Projects',
              'Advanced Conversion Insights'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-zinc-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <button 
              onClick={handlePurchase}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              Get License Key
            </button>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="TIER-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-24 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all uppercase"
              />
              <button
                onClick={handleUnlock}
                className="absolute inset-y-1.5 right-1.5 px-3 bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-50 transition-colors shadow-sm"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
