// moovy-frontend/src/types/env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_PYTHON_API_URL: string;
  readonly VITE_BYPASS_GUARDS?: "true" | "false";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
