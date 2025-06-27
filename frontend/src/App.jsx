import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import AuthenticationPage from "./pages/AuthenticationPage";
import ApiKeysPage from "./pages/ApiKeysPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/sign-in"
          element={<AuthenticationPage type="sign-in" />}
        />
        <Route
          path="/sign-up"
          element={<AuthenticationPage type="sign-up" />}
        />
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="api-keys" element={<ApiKeysPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
