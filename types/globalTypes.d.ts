export {};

declare global {
  interface Window {
    dittoCreation: any;
    Ditto: any;
    dataLayer: Record<string, any>[];
    Primer: any; // Add relevent type definition of Primer here
    fbq: any;
    TrackJS: any;
    sprChatSettings: any;
  }
}

window.dataLayer = Window.dataLayer;
