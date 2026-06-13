/** Codecanyon LED Time Panel — global constructor loaded from /vendor/time_led.js */

export interface LedConfig {
  id: string;
  type?: "time" | "countdown" | "random";
  format?: string;
  color?: string;
  bgcolor?: string;
  bgvisible?: number;
  size?: number;
  rounded?: number;
  pix_between?: number;
  hourformat?: 12 | 24;
  font?: "font1" | "font2" | "font3";
  time_zone?: number;
  timer?: string;
  length?: number;
  num?: string;
  compact_colon?: boolean;
}

declare global {
  interface Window {
    Led?: new (config: LedConfig) => void;
  }
}

export {};
