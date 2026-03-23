import { useState, useEffect, useCallback } from 'react';
import { LanguageCode, getTranslation, TranslationMap } from '../systems/language';

const LANG_STORAGE_KEY = 'app:language';

export function useLanguage() {
  const [lang, setLang] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return (stored === 'en' || stored === 'es' || stored === 'fr') ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const t = useCallback((key: keyof TranslationMap, params?: Record<string, string | number>) => {
    return getTranslation(lang, key, params);
  }, [lang]);

  return { lang, setLang, t };
}
