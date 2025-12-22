/// <reference types="vite/client" />
/// <reference types="@pptb/types" />

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    toolboxAPI: typeof import("@pptb/types").toolboxAPI;
    dataverseAPI: typeof import("@pptb/types").dataverseAPI;
  }
}

export {};
