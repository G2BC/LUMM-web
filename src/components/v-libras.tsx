import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SCRIPT_ID = "vlibras-script";
const ROOT = "https://vlibras.gov.br/app";

export default function VLibras() {
  const { i18n } = useTranslation();

  const isPortuguese = i18n.language?.toLowerCase().startsWith("pt");

  useEffect(() => {
    const init = () => {
      if (window.VLibras && !window.VLibrasWidgetInitialized) {
        new window.VLibras.Widget(ROOT);
        window.VLibrasWidgetInitialized = true;
      }
    };

    const waitForVLibras = () => {
      let attempts = 0;

      const interval = window.setInterval(() => {
        attempts++;

        if (window.VLibras) {
          clearInterval(interval);
          init();
        }

        if (attempts > 100) {
          clearInterval(interval);
        }
      }, 100);
    };

    if (window.VLibrasWidgetInitialized) {
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      waitForVLibras();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${ROOT}/vlibras-plugin.js`;
    script.async = true;

    script.onload = waitForVLibras;

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const widget = document.querySelector("[vw]") as HTMLElement | null;

    if (widget) {
      widget.style.display = isPortuguese ? "block" : "none";
    }
  }, [isPortuguese]);

  return (
    <div
      vw="true"
      className="enabled"
      style={{
        display: isPortuguese ? "block" : "none",
      }}
    >
      <div vw-access-button="true" className="active" />

      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
