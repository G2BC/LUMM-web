export {};

declare global {
  interface Window {
    VLibras?: {
      Widget: new (_url: string) => void;
    };
    VLibrasWidgetInitialized?: boolean;
  }
}
