import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceProvider = () => {
  const navigate = useNavigate();

  const viewJobs = () => {
    console.log("Navigating to ViewJobsPage1...");
    navigate("/view-jobs1"); }

  return (
    <div>
      <h1>Dashboard Service Provider</h1>
      <button onClick={viewJobs}>View Jobs</button>
    </div>
  );
};

export default ServiceProvider;
