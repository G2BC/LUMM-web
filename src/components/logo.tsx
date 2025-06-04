import logo from "@/assets/lumm_icon.png";

export function LummLogo() {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Logo LUMM" />
      <div className="flex flex-col text-white font-(family-name:--font-syne) text-nowrap overflow-hidden">
        <span className="font-extrabold text-[25px] leading-none">LUMM</span>
        <span className="text-xs">Luminescent Mushrooms</span>
      </div>
    </div>
  );
}
