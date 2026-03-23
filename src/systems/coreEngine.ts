import { PricingInput, PricingOutput } from '../types/pricing';
import { generateTiers } from './pricingTierEngine';
import { allocateFeatures } from './featureAllocator';
import { scorePricing } from './scoringEngine';

export function runEngine(input: PricingInput, isPro: boolean = false): PricingOutput {
  let tiers = generateTiers(input);
  tiers = allocateFeatures(tiers, input, isPro);
  const { score, notes } = scorePricing(input, tiers);

  return {
    tiers,
    score,
    notes
  };
}
