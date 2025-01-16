import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABIJob, contractAddressJob, contractABIBid, contractAddressBid } from "./contractConfig";

const ViewJobsPage1 = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [contractJob, setContractJob] = useState(null);
  const [contractBid, setContractBid] = useState(null);
  const [bidPrice, setBidPrice] = useState("");  
  const [bidDetails, setBidDetails] = useState("");  
  const [selectedJobId, setSelectedJobId] = useState(null);  

  // Initialize contract interaction
  const initContract = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      setAccount(await signer.getAddress());

      const jobContract = new ethers.Contract(contractAddressJob, contractABIJob, signer);
      setContractJob(jobContract);

      const bidContract = new ethers.Contract(contractAddressBid, contractABIBid, signer);
      setContractBid(bidContract);
    } else {
      alert("MetaMask nu este instalat!");
    }
  };

  const fetchJobs = async () => {
    try {
      const [descriptions, deadlines, maxBidValues] = await contractJob.getAllJobs();
      const jobs = descriptions.map((description, index) => ({
        id: index + 1,  
        description,
        deadline: new Date(Number(deadlines[index]) * 1000).toLocaleString(),
        maxBidValue: ethers.formatUnits(maxBidValues[index], "ether"),
      }));

      setJobs(jobs);
      setLoading(false);
    } catch (err) {
      console.error("Error getting the jobs:", err);
      setLoading(false);
    }
  };

  const placeBid = async (jobId) => {
    if (!bidPrice || !bidDetails) {
      alert("Fill the price and details!");
      return;
    }

    try {
      const tx = await contractBid.placeBid(jobId, ethers.parseUnits(bidPrice, "ether"), bidDetails);
      await tx.wait();
      alert("Succesfull bid!");
      setSelectedJobId(null); 
      fetchJobs();  
    } catch (err) {
      console.error("Bid error", err);
      alert("Bid error");
    }
  };

  useEffect(() => {
    initContract();
  }, []);

  useEffect(() => {
    if (contractJob && account) {
      fetchJobs();
    }
  }, [contractJob, account]);

  return (
    <div>
      <h1>Jobs</h1>
      {loading ? (
        <p>Loading</p>
      ) : jobs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Deadline</th>
              <th>Max bid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.description}</td>
                <td>{job.deadline}</td>
                <td>{job.maxBidValue}</td>
                <td>
                  <button onClick={() => setSelectedJobId(job.id)}>Place Bid</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No jobs yet.</p>
      )}

     
      {selectedJobId && (
        <div>
          <h3>Place a bid for job {selectedJobId}</h3>
          <div>
            <label>Preț ofertă (ETH):</label>
            <input
              type="text"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              placeholder="Price"
            />
          </div>
          <div>
            <label>Details:</label>
            <textarea
              value={bidDetails}
              onChange={(e) => setBidDetails(e.target.value)}
              placeholder="Details"
            />
          </div>
          <button onClick={() => placeBid(selectedJobId)}>Submit Bid</button>
          <button onClick={() => setSelectedJobId(null)}>Cancel</button> 
        </div>
      )}
    </div>
  );
};

export default ViewJobsPage1;

