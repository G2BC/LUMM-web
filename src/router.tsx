import React from "react";
import { Route, Routes } from "react-router";
import { BaseLayout } from "./components/base-layout";

const HomePage = React.lazy(() => import("./pages/home"));
const ExplorePage = React.lazy(() => import("./pages/explore"));
const AboutPage = React.lazy(() => import("./pages/about"));
const PublicationsPage = React.lazy(() => import("./pages/publications"));
const LoginPage = React.lazy(() => import("./pages/login"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const DistributionPage = React.lazy(() => import("./pages/distribution"));

function Router() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/distribuicao" element={<DistributionPage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/publicacoes" element={<PublicationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
