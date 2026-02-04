export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_HR_PAGE_PASSWORD?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
