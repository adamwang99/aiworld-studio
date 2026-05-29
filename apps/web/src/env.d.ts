/// <reference types="vite/client" />

declare global {
  interface Window {
    aiworldStudio?: {
      platform: string;
      version: string;
    };
  }
}

export {};
