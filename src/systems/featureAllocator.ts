import { PricingInput, Tier } from '../types/pricing';

export function allocateFeatures(tiers: Tier[], input: PricingInput, isPro: boolean = false): Tier[] {
  const featureCount = Math.max(3, input.featureCount);
  const { premiumEmphasis, productType } = input;

  // Generic pool for free users or fallback
  let featurePool = [
    "Core Platform Access",
    "Standard Support",
    "Basic Analytics",
    "Custom Domain",
    "API Access",
    "Team Collaboration",
    "Advanced Reporting",
    "Priority Support",
    "White-labeling",
    "Dedicated Account Manager",
    "SSO / SAML",
    "Custom Integrations",
    "Audit Logs",
    "Uptime SLA",
    "Onboarding Specialist",
    "Role-based Access Control",
    "Data Export",
    "Custom Branding",
    "24/7 Phone Support",
    "Dedicated Infrastructure"
  ];

  // Pro users get industry-specific tailored features
  if (isPro) {
    if (productType === 'creator') {
      featurePool = [
        "Digital Downloads", "Email Newsletter", "Basic Analytics", "Custom Domain", 
        "Community Forum", "Drip Campaigns", "Advanced Analytics", "Priority Support", 
        "Remove Branding", "1-on-1 Coaching", "API Access", "Affiliate Program",
        "Multiple Authors", "Custom CSS", "Dedicated Manager", "White-glove Migration",
        "SSO for Members", "Custom App", "Revenue Sharing", "SLA Guarantee"
      ];
    } else if (productType === 'agency') {
      featurePool = [
        "Client Portal", "Basic Reporting", "Task Management", "Custom Domain",
        "White-label Reports", "Time Tracking", "Advanced Analytics", "Priority Support",
        "Custom Branding", "Dedicated Account Manager", "API Access", "Client Billing",
        "Multiple Workspaces", "Custom Workflows", "Strategy Sessions", "On-site Training",
        "SSO / SAML", "Custom Integrations", "Audit Logs", "Uptime SLA"
      ];
    } else if (productType === 'dev_tool') {
      featurePool = [
        "Core API Access", "Community Support", "Basic Usage Limits", "Custom Domain",
        "Webhooks", "Team Collaboration", "Advanced Usage Limits", "Priority Support",
        "White-labeling", "Dedicated Account Manager", "SSO / SAML", "Custom Integrations",
        "Audit Logs", "Uptime SLA", "Onboarding Specialist", "Role-based Access Control",
        "Data Export", "Custom Branding", "24/7 Phone Support", "Dedicated Infrastructure"
      ];
    } else if (productType === 'local_biz') {
      featurePool = [
        "Online Booking", "Basic CRM", "Email Reminders", "Custom Domain",
        "SMS Reminders", "Staff Management", "Advanced Reporting", "Priority Support",
        "White-labeling", "Dedicated Account Manager", "POS Integration", "Custom Integrations",
        "Audit Logs", "Uptime SLA", "Onboarding Specialist", "Multi-location Support",
        "Data Export", "Custom Branding", "24/7 Phone Support", "Dedicated Infrastructure"
      ];
    }
  }

  const features = featurePool.slice(0, Math.min(featureCount, featurePool.length));
  
  // If they asked for more features than we have in the pool, generate generic ones
  while (features.length < featureCount) {
    features.push(`Additional Feature ${features.length + 1}`);
  }

  // Allocation logic
  let basicCount = Math.max(1, Math.floor(featureCount * 0.3));
  let proCount = Math.max(basicCount + 1, Math.floor(featureCount * 0.7));

  // Adjust based on premium emphasis
  if (premiumEmphasis > 7) {
    basicCount = Math.max(1, basicCount - 1);
    proCount = Math.max(basicCount + 1, proCount - 1);
  } else if (premiumEmphasis < 4) {
    basicCount += 1;
    proCount += 1;
  }

  basicCount = Math.min(basicCount, featureCount - 2);
  proCount = Math.min(proCount, featureCount - 1);

  tiers[0].features = features.slice(0, basicCount);
  tiers[1].features = features.slice(0, proCount);
  
  // Premium gets all, but let's mark the exclusive ones
  const premiumExclusives = features.slice(proCount).map(f => `${f} (Premium Only)`);
  tiers[2].features = [...tiers[1].features, ...premiumExclusives];

  return tiers;
}
