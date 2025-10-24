import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[50vh] flex-col h-full">
      <h1 className="text-primary font-bold text-[100px] sm:text-[200px]">404</h1>

      <h2 className="text-[28px] sm:text-[46px] text-white font-light">
        {t("not_found_page.title")}
      </h2>

      <h3 className="text-[16px] sm:text-[20px] text-white font-medium mt-6 text-center">
        {t("not_found_page.text")}
        <br /> {t("not_found_page.suggestion")}
      </h3>

      <Button onClick={() => navigate("/")} className="mt-8 h-[48px] font-semibold">
        {t("not_found_page.button")}
      </Button>
    </div>
  );
}
