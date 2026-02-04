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
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}
