import React, { useState } from "react";
import { ethers } from "ethers";
import { contractABIJob, contractAddressJob } from "./contractConfig";

const CreateJobPage = () => {
  const [jobDetails, setJobDetails] = useState({
    description: "",
    deadline: "",
    maxBidValue: "",
  });
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [jobCreated, setJobCreated] = useState(false); 

  // Initialize contract interaction
  const initContract = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      const signer = await web3Provider.getSigner();
      const jobContract = new ethers.Contract(
        contractAddressJob,
        contractABIJob,
        signer
      );
      setContract(jobContract);
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the job creation form
  const handleCreateJob = async (e) => {
    e.preventDefault();

    const { description, deadline, maxBidValue } = jobDetails;

    if (!description || !deadline || !maxBidValue) {
      alert("Fill everything!");
      return;
    }

    try {
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000); 
      const tx = await contract.createJob(
        description,
        deadlineTimestamp,
        ethers.parseUnits(maxBidValue, "ether") 
      );

      await tx.wait(); 
      setJobCreated(true); 
      alert("Job created!");
    } catch (err) {
      console.error("Job error:", err);
      alert("Job error.");
    }
  };
  
  // Initialize contract on component load
  React.useEffect(() => {
    initContract();
  }, []);

  return (
    <div>
      <h1>Create a Job</h1>
      {!jobCreated ? (
        <form onSubmit={handleCreateJob}>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={jobDetails.description}
              onChange={handleInputChange}
              placeholder="Describe the job"
            ></textarea>
          </div>
          <div>
            <label>Deadline:</label>
            <input
              type="datetime-local"
              name="deadline"
              value={jobDetails.deadline}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Max bid:</label>
            <input
              type="number"
              name="maxBidValue"
              value={jobDetails.maxBidValue}
              onChange={handleInputChange}
              placeholder="Max bid"
            />
          </div>
          <button type="submit">Create job</button>
        </form>
      ) : (
        <div>
          <h2>Job created!</h2>
          <button onClick={() => window.location.href = "/view-jobs"}>
            View Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;

