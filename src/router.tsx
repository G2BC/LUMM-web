import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { BaseLayout } from "./components/base-layout";
import { DEFAULT_LOCALE } from "./lib/lang";
import LanguageGuard from "./components/language-guard";
import { useLanguageStore } from "./stores/useLanguageStore";
import { AuthGuard } from "./components/auth-guard";

const HomePage = React.lazy(() => import("./pages/home"));
const ExplorePage = React.lazy(() => import("./pages/explore"));
const AboutPage = React.lazy(() => import("./pages/about"));
const PublicationsPage = React.lazy(() => import("./pages/publications"));
const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const ChangePasswordPage = React.lazy(() => import("./pages/change-password"));
const DistributionPage = React.lazy(() => import("./pages/distribution"));
const SpeciesPage = React.lazy(() => import("./pages/species"));
const ContactPage = React.lazy(() => import("./pages/contact"));
const ContributorsPage = React.lazy(() => import("./pages/contributors"));
const InternalPanelPage = React.lazy(() => import("./pages/panel"));
const PanelOverviewPage = React.lazy(() => import("./pages/panel/overview"));
const PanelUsersPage = React.lazy(() => import("./pages/panel/users"));
const NotFoundPage = React.lazy(() => import("./pages/404"));

function Router() {
  const { language } = useLanguageStore();
  const initialLang = language ?? DEFAULT_LOCALE;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${initialLang}`} replace />} />
      <Route path="/painel" element={<Navigate to={`/${initialLang}/painel`} replace />} />
      <Route
        path="/trocar-senha"
        element={<Navigate to={`/${initialLang}/trocar-senha`} replace />}
      />

      <Route path="/:lang" element={<LanguageGuard />}>
        <Route path="painel" element={<AuthGuard />}>
          <Route element={<InternalPanelPage />}>
            <Route index element={<PanelOverviewPage />} />
            <Route element={<AuthGuard requireAdmin />}>
              <Route path="usuarios" element={<PanelUsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route path="distribuicao" element={<DistributionPage />} />
          <Route path="explorar" element={<ExplorePage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="publicacoes" element={<PublicationsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
          <Route path="trocar-senha" element={<AuthGuard requireUser={false} />}>
            <Route index element={<ChangePasswordPage />} />
          </Route>
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
