import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./components/RegisterPage";
import ClientPage from "./components/ClientPage";
import ViewJobsPage from "./components/ViewJobsPage";
import ServiceProvider from "./components/ServiceProviderPage";
import ViewJobsPage1 from "./components/ViewJobsPage1";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/view-jobs" element={<ViewJobsPage />} />
        <Route path="/service-provider" element={<ServiceProvider />} />
        <Route path="/view-jobs1" element={<ViewJobsPage1 />} />
      </Routes>
    </Router>
  );
};

export default App;


