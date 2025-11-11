// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_DB_NAME: string;
  readonly VITE_APP_DB_VERSION: string;
  readonly VITE_APP_STORE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
