// src/routes/guards/guardUtils.ts
export function isGuardBypassed(): boolean {
   // PROD에선 어떤 값이 와도 무시
   if (import.meta.env.PROD) return false
   return (
      String(import.meta.env.VITE_BYPASS_GUARDS ?? '')
         .trim()
         .toLowerCase() === 'true'
   )
}
