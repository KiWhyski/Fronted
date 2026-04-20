/**
 * Modo solo-frontend: sin backend real (axios mock, login simulado, etc.).
 * Por defecto está activo; desactívalo con VITE_FRONTEND_ONLY=false (p. ej. contra API real).
 */
export function isFrontendOnly() {
  return import.meta.env.VITE_FRONTEND_ONLY !== 'false';
}
