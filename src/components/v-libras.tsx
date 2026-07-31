import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const VLibras = () => {
  const { i18n } = useTranslation();
  const isPortuguese = i18n.language?.toLowerCase().startsWith("pt");

  useEffect(() => {
    if (!isPortuguese) return;

    const scriptId = "vlibras-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initWidget = () => {
      if (window.VLibras && !window.VLibrasWidgetInitialized) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        window.VLibrasWidgetInitialized = true;
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.onload = () => {
        initWidget();
        // O script do VLibras subscreve o window.onload para inicializar seus elementos.
        // Se a página já terminou de carregar (comum em SPAs ou carregamento dinâmico),
        // o navegador não disparará o window.onload novamente. Portanto, chamamos manualmente.
        if (document.readyState === "complete" || document.readyState === "interactive") {
          if (typeof window.onload === "function") {
            window.onload(new Event("load"));
          }
        }
      };
      document.body.appendChild(script);
    } else if (window.VLibras) {
      initWidget();
    }

    const widgetElement = document.querySelector("[vw]") as HTMLElement | null;
    if (widgetElement) {
      widgetElement.style.display = "block";
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
