import { useTranslation } from "react-i18next";
import CollaboratorsSection from "./components/collaborators";
import ResearchGroupsSection from "./components/research_groups";

export default function ContributorsPage() {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto pt-10 px-4">
      <h1 className="text-[40px] xl:text-[50px] font-bold text-white mb-10">
        {t("header.collaborators")}
      </h1>

      <h2 className="text-[28px] xl:text-[34px] font-semibold text-white mb-6">
        {t("collaborators_page.groups")}
      </h2>

      <ResearchGroupsSection />

      <h2 className="text-[28px] xl:text-[34px] font-semibold text-white mt-12 mb-6">
        {t("collaborators_page.team")}
      </h2>

      <CollaboratorsSection />
    </section>
  );
}
