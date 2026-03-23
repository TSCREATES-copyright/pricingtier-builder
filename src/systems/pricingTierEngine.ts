import { PricingInput, Tier, TargetMarket } from '../types/pricing';

export function generateTiers(input: PricingInput): Tier[] {
  const { basePrice, spacingMode, targetMarket, charmPricing, annualDiscount } = input;

  // Determine multipliers based on spacing mode
  let m1 = 2.0;
  let m2 = 2.5;

  if (spacingMode === 'conservative') {
    m1 = 1.6; m2 = 1.8;
  } else if (spacingMode === 'geometric') {
    m1 = 2.2; m2 = 2.6;
  } else if (spacingMode === 'aggressive') {
    m1 = 2.8; m2 = 3.2;
  }

  // Adjust multipliers slightly based on target market
  if (targetMarket === 'enterprise' || targetMarket === 'agencies') {
    m1 += 0.4; m2 += 0.5;
  } else if (targetMarket === 'creators' || targetMarket === 'indie') {
    m1 -= 0.2; m2 -= 0.2;
  }

  const basicPrice = basePrice;
  const proPrice = Math.round(basicPrice * m1);
  const premiumPrice = Math.round(proPrice * m2);

  // IMPROVEMENT 1: Market-Aware Dynamic Rounding
  const roundPrice = (p: number, market: TargetMarket) => {
    if (p < 10) return p;
    
    let rounded = p;
    // B2B / Enterprise expects clean, round numbers
    if (market === 'enterprise' || market === 'agencies' || market === 'smb') {
      if (p < 50) rounded = Math.floor(p / 5) * 5;
      else if (p < 200) rounded = Math.floor(p / 10) * 10;
      else rounded = Math.floor(p / 50) * 50;
    } else {
      // B2C / Indie expects psychological .99 pricing
      if (p < 50) rounded = Math.floor(p / 10) * 10 + 9;
      else if (p < 150) rounded = Math.floor(p / 10) * 10 + 9;
      else if (p < 500) rounded = Math.floor(p / 50) * 50 + 49;
      else rounded = Math.floor(p / 100) * 100 + 99;
    }

    // Apply Charm Pricing override if toggled
    if (charmPricing) {
      // Convert e.g. 50 to 49, 100 to 99
      if (rounded % 10 === 0) rounded -= 1;
      else if (rounded % 5 === 0) rounded -= 1;
    }

    return rounded;
  };

  const calcAnnual = (monthly: number) => {
    const discounted = monthly * (1 - annualDiscount / 100);
    return charmPricing ? Math.floor(discounted) - 1 : Math.floor(discounted);
  };

  const finalBasic = roundPrice(basicPrice, targetMarket);
  const finalPro = roundPrice(proPrice, targetMarket);
  const finalPremium = roundPrice(premiumPrice, targetMarket);

  return [
    { name: 'Basic', priceMonthly: finalBasic, priceAnnual: calcAnnual(finalBasic), features: [], emphasis: 'entry' },
    { name: 'Pro', priceMonthly: finalPro, priceAnnual: calcAnnual(finalPro), features: [], emphasis: 'core' },
    { name: 'Premium', priceMonthly: finalPremium, priceAnnual: calcAnnual(finalPremium), features: [], emphasis: 'premium' },
  ];
}
