import { Tier } from '../types/pricing';
import { LanguageCode, getTranslation } from './language';

export function formatExportText(tiers: Tier[], lang: LanguageCode): string {
  const t = (key: any, params?: any) => getTranslation(lang, key, params);
  
  let output = `${t('export.title')}\n\n`;

  tiers.forEach((tier, index) => {
    const isPro = tier.emphasis === 'core';
    const recommended = isPro ? ` ${t('export.plan.recommended')}` : '';
    
    output += `${tier.name} Plan${recommended}\n`;
    output += `- ${t('export.plan.price', { priceMonthly: tier.priceMonthly, priceAnnual: tier.priceAnnual })}\n`;
    output += `- ${t('export.plan.includes', { count: tier.features.length })}\n`;
    
    let positioning = '';
    if (index === 0) positioning = t('export.plan.bestFor');
    else if (index === 1) positioning = t('export.plan.idealFor');
    else positioning = t('export.plan.designedFor');
    
    output += `- ${positioning}\n\n`;
  });

  return output.trim();
}
