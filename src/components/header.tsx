import { Menu } from "lucide-react";
import { LummLogo } from "./logo";

export function Header() {
  return (
    <header className="h-20 w-full bg-[#0D140E] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <LummLogo />
        <div className="sm:hidden">
          <Menu className="text-[#00C000] w-8 h-8 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
