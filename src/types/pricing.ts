export type ProductType = 'saas_b2b' | 'creator' | 'agency' | 'dev_tool' | 'local_biz';
export type TargetMarket = 'indie' | 'smb' | 'enterprise' | 'creators' | 'agencies';
export type SpacingMode = 'conservative' | 'geometric' | 'aggressive';

export interface PricingInput {
  productType: ProductType;
  targetMarket: TargetMarket;
  basePrice: number;
  spacingMode: SpacingMode;
  featureCount: number;
  premiumEmphasis: number; // 1 to 10
  annualDiscount: number; // 0 to 50
  charmPricing: boolean; // true for .99 endings
}

export interface Tier {
  name: 'Basic' | 'Pro' | 'Premium';
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  emphasis: 'entry' | 'core' | 'premium';
}

export interface ScoreBreakdown {
  simplicity: number;
  upgradePressure: number;
  marginPotential: number;
  differentiation: number;
  marketFit: number;
  total: number;
}

export interface PricingOutput {
  tiers: Tier[];
  score: ScoreBreakdown;
  notes: string[];
}

export interface PricingProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  input: PricingInput;
  output: PricingOutput;
}
