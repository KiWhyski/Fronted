/**
 * Cuando VITE_FRONTEND_ONLY=true, la app no depende del backend:
 * login/registro simulados, HTTP con respuestas mock y servicios sueltos acortados.
 */
export function isFrontendOnly() {
  return import.meta.env.VITE_FRONTEND_ONLY === 'true';
}
