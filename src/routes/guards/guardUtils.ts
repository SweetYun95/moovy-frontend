// src/routes/guards/guardUtils.ts
export function isGuardBypassed() {
   return import.meta.env.VITE_BYPASS_GUARDS === 'true'
}
