export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_RECAPTCHA_SITE_KEY?: string;
    readonly VITE_HR_PAGE_PASSWORD?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface Window {
    grecaptcha?: {
      enterprise?: {
        ready: (cb: () => void) => void;
        execute: (
          siteKey: string,
          options: { action: string },
        ) => Promise<string>;
      };
    };
  }
}
