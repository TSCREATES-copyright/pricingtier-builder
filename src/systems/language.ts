export type LanguageCode = 'en' | 'es' | 'fr';

export interface TranslationMap {
  'export.title': string;
  'export.plan.price': string;
  'export.plan.includes': string;
  'export.plan.bestFor': string;
  'export.plan.recommended': string;
  'export.plan.idealFor': string;
  'export.plan.designedFor': string;
  'ui.export.button': string;
  'ui.export.copied': string;
  'ui.export.preview': string;
  'ui.export.proFeature': string;
}

export const languages: Record<LanguageCode, TranslationMap> = {
  en: {
    'export.title': 'Pricing Strategy',
    'export.plan.price': 'Price: ${priceMonthly} per month or ${priceAnnual} per year',
    'export.plan.includes': 'Includes {count} features',
    'export.plan.bestFor': 'Best for individuals getting started',
    'export.plan.recommended': '(Recommended)',
    'export.plan.idealFor': 'Ideal for growing users who need more flexibility',
    'export.plan.designedFor': 'Designed for power users and teams',
    'ui.export.button': 'Export Pricing Copy',
    'ui.export.copied': 'Copied to Clipboard',
    'ui.export.preview': 'Export Preview',
    'ui.export.proFeature': 'Pro Feature',
  },
  es: {
    'export.title': 'Estrategia de Precios',
    'export.plan.price': 'Precio: ${priceMonthly} por mes o ${priceAnnual} por año',
    'export.plan.includes': 'Incluye {count} características',
    'export.plan.bestFor': 'Ideal para personas que están empezando',
    'export.plan.recommended': '(Recomendado)',
    'export.plan.idealFor': 'Ideal para usuarios en crecimiento que necesitan más flexibilidad',
    'export.plan.designedFor': 'Diseñado para usuarios avanzados y equipos',
    'ui.export.button': 'Exportar Precios',
    'ui.export.copied': 'Copiado al portapapeles',
    'ui.export.preview': 'Vista Previa de Exportación',
    'ui.export.proFeature': 'Función Pro',
  },
  fr: {
    'export.title': 'Stratégie de Prix',
    'export.plan.price': 'Prix : {priceMonthly} $ par mois ou {priceAnnual} $ par an',
    'export.plan.includes': 'Comprend {count} fonctionnalités',
    'export.plan.bestFor': 'Idéal pour les personnes qui débutent',
    'export.plan.recommended': '(Recommandé)',
    'export.plan.idealFor': 'Idéal pour les utilisateurs en croissance qui ont besoin de plus de flexibilité',
    'export.plan.designedFor': 'Conçu pour les utilisateurs avancés et les équipes',
    'ui.export.button': 'Exporter les Prix',
    'ui.export.copied': 'Copié dans le presse-papiers',
    'ui.export.preview': 'Aperçu de l\'exportation',
    'ui.export.proFeature': 'Fonctionnalité Pro',
  }
};

export function getTranslation(lang: LanguageCode, key: keyof TranslationMap, params?: Record<string, string | number>): string {
  let text = languages[lang][key] || languages['en'][key] || key;
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  
  return text;
}
