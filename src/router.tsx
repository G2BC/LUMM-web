import React from "react";
import { Route, Routes } from "react-router";

const HomePage = React.lazy(() => import("./pages/home"));

function Router() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  );
}

export default Router;
