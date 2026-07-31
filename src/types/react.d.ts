import "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    vw?: boolean | string;
    "vw-access-button"?: string;
    "vw-plugin-wrapper"?: string;
  }
}
