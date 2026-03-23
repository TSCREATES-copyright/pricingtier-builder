import { VALID_LICENSE_KEYS, LicenseState } from '../types/license';

const STORAGE_KEY = 'pricing_pro_license_state';

export const validateLicenseKey = (key: string): boolean => {
  const normalized = key.trim().toUpperCase();
  const isValidFormat = /^TIER-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized);
  if (!isValidFormat) return false;
  return VALID_LICENSE_KEYS.includes(normalized);
};

export const unlockPro = (key: string): boolean => {
  if (validateLicenseKey(key)) {
    const state: LicenseState = {
      isProUnlocked: true,
      licenseKey: key.trim().toUpperCase(),
      unlockedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  }
  return false;
};

export const checkProStatus = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Fallback for previous implementation
      if (localStorage.getItem('pricing_pro_unlocked') === 'true') {
        return true;
      }
      return false;
    }
    const state: LicenseState = JSON.parse(stored);
    return state.isProUnlocked && validateLicenseKey(state.licenseKey || '');
  } catch {
    return false;
  }
};
