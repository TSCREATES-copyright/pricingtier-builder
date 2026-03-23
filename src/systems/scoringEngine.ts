import { PricingInput, Tier, ScoreBreakdown } from '../types/pricing';

export function scorePricing(input: PricingInput, tiers: Tier[]): { score: ScoreBreakdown, notes: string[] } {
  const notes: string[] = [];

  let simplicity = 85;
  let upgradePressure = 75;
  let marginPotential = 70;
  let differentiation = 80;
  let marketFit = 80;

  const [basic, pro, premium] = tiers;

  // Analyze spacing
  const proRatio = pro.priceMonthly / Math.max(1, basic.priceMonthly);
  const premiumRatio = premium.priceMonthly / Math.max(1, pro.priceMonthly);

  if (proRatio < 1.5) {
    upgradePressure -= 25;
    differentiation -= 15;
    notes.push("Pro price is too close to Basic. Users might not see the value in upgrading.");
  } else if (proRatio > 3.5) {
    upgradePressure += 10;
    simplicity -= 15;
    notes.push("Large price jump from Basic to Pro. This might cause friction for upgrades.");
  } else {
    upgradePressure += 15;
  }

  if (premiumRatio < 1.5) {
    marginPotential -= 25;
    notes.push("Premium is too cheap compared to Pro. You are likely leaving money on the table.");
  } else if (premiumRatio > 3) {
    marginPotential += 20;
    notes.push("Premium is positioned well as a true enterprise/luxury anchor tier.");
  }

  // Analyze features
  const basicFeatRatio = basic.features.length / Math.max(1, premium.features.length);
  if (basicFeatRatio > 0.6) {
    upgradePressure -= 20;
    notes.push("Basic plan gives away too much value. Consider moving features to Pro.");
  } else if (basicFeatRatio < 0.2) {
    simplicity -= 10;
    notes.push("Basic plan might be too restricted to be useful.");
  }

  // Market fit
  if (input.targetMarket === 'indie' && basic.priceMonthly > 29) {
    marketFit -= 25;
    notes.push("Entry price is likely too high for Indie Hackers/Solo founders.");
  }
  if (input.targetMarket === 'enterprise' && premium.priceMonthly < 199) {
    marketFit -= 20;
    marginPotential -= 15;
    notes.push("Enterprise buyers expect higher pricing. A low price might signal low quality.");
  }

  const clamp = (val: number) => Math.max(0, Math.min(100, val));

  const score = {
    simplicity: clamp(simplicity),
    upgradePressure: clamp(upgradePressure),
    marginPotential: clamp(marginPotential),
    differentiation: clamp(differentiation),
    marketFit: clamp(marketFit),
    total: 0
  };

  score.total = Math.round(
    (score.simplicity * 0.2) + 
    (score.upgradePressure * 0.3) + 
    (score.marginPotential * 0.2) + 
    (score.differentiation * 0.15) + 
    (score.marketFit * 0.15)
  );

  if (score.total > 85) {
    notes.push("This structure is highly balanced and ready to test.");
  }

  return { score, notes };
}
