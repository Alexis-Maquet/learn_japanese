import { logger } from '@/utils/logger';

/**
 * Lit et décode une valeur JSON du localStorage. Une valeur absente, illisible ou
 * qui ne passe pas la validation est supprimée et renvoie null, sans faire planter la page.
 */
export function readJson<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return null; // accès au stockage refusé (navigation privée, politique du navigateur)
  }
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (isValid(value)) return value;
  } catch {
    // JSON corrompu : traité comme une valeur invalide
  }
  logger.warn('storage', `Valeur invalide supprimée du localStorage : ${key}`);
  try { localStorage.removeItem(key); } catch { /* rien à faire */ }
  return null;
}
