import type { DetailedHTMLProps, HTMLAttributes } from "react";

type WC = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  class?: string;
  [key: `data-${string}`]: string | undefined;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "k3ui-mason": WC & { columns?: string; gap?: string };
      "k3ui-card": WC;
      "k3ui-field": WC & {
        label?: string;
        placeholder?: string;
        variant?: string;
        type?: string;
        name?: string;
        "leading-icon"?: string;
        "trailing-icon"?: string;
      };
      "k3ui-button": WC & { variant?: string; size?: string };
      "k3ui-button-icon": WC & { variant?: string };
      "k3ui-navigation-bar": WC;
      "k3ui-segmented-button": WC;
    }
  }
}

export {};
