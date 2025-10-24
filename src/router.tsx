import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { BaseLayout } from "./components/base-layout";
import { DEFAULT_LOCALE } from "./lib/lang";
import LanguageGuard from "./components/language-guard";
import { useLanguageStore } from "./stores/useLanguageStore";

const HomePage = React.lazy(() => import("./pages/home"));
const ExplorePage = React.lazy(() => import("./pages/explore"));
const AboutPage = React.lazy(() => import("./pages/about"));
const PublicationsPage = React.lazy(() => import("./pages/publications"));
const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const DistributionPage = React.lazy(() => import("./pages/distribution"));
const SpeciesPage = React.lazy(() => import("./pages/species"));
const ContactPage = React.lazy(() => import("./pages/contact"));
const ContributorsPage = React.lazy(() => import("./pages/contributors"));
const NotFoundPage = React.lazy(() => import("./pages/404"));

function Router() {
  const { language } = useLanguageStore();
  const initialLang = language ?? DEFAULT_LOCALE;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${initialLang}`} replace />} />

      <Route path="/:lang" element={<LanguageGuard />}>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route path="distribuicao" element={<DistributionPage />} />
          <Route path="explorar" element={<ExplorePage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="publicacoes" element={<PublicationsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
          <Route path="especie/:species" element={<SpeciesPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="colaboradores" element={<ContributorsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;
