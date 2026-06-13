import type { DetailedHTMLProps, HTMLAttributes } from "react";

type WC = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  class?: string;
  slot?: string;
  [key: `data-${string}`]: string | undefined;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      i: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        type?: string;
        size?: string;
      };
      "k3ui-appbar": WC & {
        variant?: "small" | "center" | "search" | "medium" | "large";
        fixed?: string;
        "collapse-distance"?: string;
      };
      "k3ui-dialog": WC & { title?: string; id?: string };
      "k3ui-mason": WC & { columns?: string; gap?: string };
      "k3ui-card": WC;
      "k3ui-field": WC & {
        label?: string;
        placeholder?: string;
        variant?: string;
        type?: string;
        name?: string;
        value?: string;
        helper?: string;
        autofocus?: string;
        "leading-icon"?: string;
        "trailing-icon"?: string;
      };
      "k3ui-button": WC & { variant?: string; size?: string };
      "k3ui-button-icon": WC & { variant?: string };
      "k3ui-navigation-bar": WC;
      "k3ui-segmented-button": WC;
      "k3ui-menu": WC & { id?: string };
      "k3ui-button-split": WC & {
        id?: string;
        label?: string;
        variant?: string;
        size?: string;
        shape?: string;
        "icon-type"?: string;
        "leading-icon"?: string;
      };
      "k3ui-select": WC & { id?: string };
      "menu-item": WC & {
        "data-id"?: string;
        "data-label"?: string;
        "data-trailing-icon"?: string;
      };
      "menu-divider": WC;
    }
  }
}

export {};
