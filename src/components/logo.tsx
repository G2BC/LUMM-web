import logo from "@/assets/lumm_icon.png";
import { cn } from "@/lib/utils";
import type React from "react";

type LummLogoProps = {
  textClassName?: string;
  textOnly?: boolean;
  textStyles?: React.CSSProperties;
};

export function LummLogo({ textClassName, textOnly = false, textStyles = {} }: LummLogoProps) {
  return (
    <div className={cn("flex items-center", textOnly ? "gap-0" : "gap-2")}>
      {!textOnly && <img src={logo} alt="Logo LUMM" />}
      <div
        className={cn(
          "flex flex-col text-white font-(family-name:--font-syne) text-nowrap overflow-hidden",
          textClassName
        )}
        style={textStyles}
      >
        <span className="font-extrabold text-[25px] lg:text-[29.3px] leading-none">LUMM</span>
        <span className="text-xs lg:text-sm">Luminescent Mushrooms</span>
      </div>
    </div>
  );
}
