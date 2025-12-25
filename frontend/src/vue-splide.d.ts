declare module "@splidejs/vue-splide" {
  import { DefineComponent } from "vue";

  export interface SplideOptions {
    type?: "slide" | "loop" | "fade";
    rewind?: boolean;
    speed?: number;
    rewindSpeed?: number;
    rewindByDrag?: boolean;
    width?: number | string;
    height?: number | string;
    fixedWidth?: number | string;
    fixedHeight?: number | string;
    heightRatio?: number;
    autoWidth?: boolean;
    autoHeight?: boolean;
    perPage?: number;
    perMove?: number;
    clones?: number;
    start?: number;
    focus?: number | "center";
    gap?: number | string;
    padding?:
      | number
      | string
      | { left?: number | string; right?: number | string };
    arrows?: boolean;
    pagination?: boolean;
    easing?: string;
    easingFunc?: (t: number) => number;
    drag?: boolean | "free";
    snap?: boolean;
    noDrag?: string;
    dragMinThreshold?: number | { mouse?: number; touch?: number };
    flickPower?: number;
    flickMaxPages?: number;
    waitForTransition?: boolean;
    arrowPath?: string;
    autoplay?: boolean | "pause";
    interval?: number;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    resetProgress?: boolean;
    lazyLoad?: boolean | "nearby" | "sequential";
    preloadPages?: number;
    keyboard?: boolean | "focused" | "global";
    wheel?: boolean;
    wheelMinThreshold?: number;
    wheelSleep?: number;
    releaseWheel?: boolean;
    direction?: "ltr" | "rtl" | "ttb";
    cover?: boolean;
    slideFocus?: boolean;
    focusableNodes?: string;
    isNavigation?: boolean;
    trimSpace?: boolean | "move";
    updateOnMove?: boolean;
    throttle?: number;
    destroy?: boolean;
    breakpoints?: {
      [key: number]: Partial<SplideOptions>;
    };
    classes?: {
      [key: string]: string;
    };
    i18n?: {
      [key: string]: string;
    };
    reducedMotion?: {
      [key: string]: any;
    };
    [key: string]: any;
  }

  export const Splide: DefineComponent<{
    options?: SplideOptions;
    extensions?: any;
    transition?: any;
    hasTrack?: boolean;
    tag?: string;
  }>;

  export const SplideSlide: DefineComponent<{
    tag?: string;
  }>;

  export const SplideTrack: DefineComponent<{
    tag?: string;
  }>;
}

declare module "@splidejs/vue-splide/css" {
  const content: any;
  export default content;
}
