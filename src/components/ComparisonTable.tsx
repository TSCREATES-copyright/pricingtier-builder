import React from 'react';
import { Tier } from '../types/pricing';
import { Check, Minus } from 'lucide-react';

interface ComparisonTableProps {
  tiers: Tier[];
}

export function ComparisonTable({ tiers }: ComparisonTableProps) {
  // Extract all unique features across all tiers
  const allFeatures = Array.from(new Set(tiers.flatMap(t => t.features.map(f => f.replace(' (Premium Only)', '')))));

  return (
    <div className="mt-16 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-200 bg-zinc-50/50">
        <h3 className="text-lg font-semibold text-zinc-900">Feature Comparison</h3>
        <p className="text-sm text-zinc-500 mt-1">Detailed breakdown of what's included in each plan.</p>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm relative">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="border-b border-zinc-200 bg-zinc-50/95 backdrop-blur-sm">
              <th className="p-4 font-medium text-zinc-500 w-1/3">Features</th>
              {tiers.map(tier => {
                const isProTier = tier.emphasis === 'core';
                return (
                  <th key={tier.name} className={`p-4 font-semibold text-center w-2/9 ${isProTier ? 'text-emerald-700 bg-emerald-50/50' : 'text-zinc-900'}`}>
                    {tier.name}
                    {isProTier && <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-1">Recommended</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {allFeatures.map((feature, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                <td className="p-4 text-zinc-700 font-medium">{feature}</td>
                {tiers.map(tier => {
                  const hasFeature = tier.features.some(f => f.replace(' (Premium Only)', '') === feature);
                  const isProTier = tier.emphasis === 'core';
                  return (
                    <td key={tier.name} className={`p-4 text-center ${isProTier ? 'bg-emerald-50/30' : ''}`}>
                      {hasFeature ? (
                        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 text-zinc-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
