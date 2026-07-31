import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const VLibras = () => {
  const { i18n } = useTranslation();
  const isPortuguese = i18n.language?.toLowerCase().startsWith("pt");

  useEffect(() => {
    const scriptId = "vlibras-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (isPortuguese) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.async = true;
        script.onload = () => {
          if (window.VLibras) {
            new window.VLibras.Widget("https://vlibras.gov.br/app");
          }
        };
        document.body.appendChild(script);
      } else if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    }

    const widgetElement = document.querySelector("[vw]") as HTMLElement | null;
    if (widgetElement) {
      widgetElement.style.display = isPortuguese ? "block" : "none";
    }
  }, [isPortuguese]);

  return (
    <div vw="true" className="enabled" style={{ display: isPortuguese ? "block" : "none" }}>
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
};

export default VLibras;
