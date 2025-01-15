import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { contractABIJob, contractAddressJob, contractABIBid, contractAddressBid } from "./contractConfig";

const ViewJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contractJob, setContractJob] = useState(null);
  const [contractBid, setContractBid] = useState(null);
  const [selectedJobBids, setSelectedJobBids] = useState([]); 
  const [showBids, setShowBids] = useState(false); 
  const [selectedJobId, setSelectedJobId] = useState(null); 

  const initContract = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      const signer = await web3Provider.getSigner();
      setAccount(await signer.getAddress());

      const jobContract = new ethers.Contract(
        contractAddressJob,
        contractABIJob,
        signer
      );
      setContractJob(jobContract);

      const bidContract = new ethers.Contract(
        contractAddressBid,
        contractABIBid,
        signer
      );
      setContractBid(bidContract);
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
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
      console.error("Eroare la obținerea joburilor:", err);
      setLoading(false);
    }
  }, [contractJob]);

  // Fetch bids for a job
  const fetchBids = useCallback(async (jobId) => {
    try {
      const bids = await contractBid.getBids(jobId);
      return bids;
    } catch (err) {
      console.error("Getting bids error:", err);
    }
  }, [contractBid]);

  

  useEffect(() => {
    const init = async () => {
      await initContract();
    };
    init();
  }, []);

  useEffect(() => {
    if (contractJob && account) {
      fetchJobs();
    }
  }, [contractJob, account, fetchJobs]);

  const handleViewBids = async (jobId) => {
    const bids = await fetchBids(jobId);
    setSelectedJobBids(bids);
    setSelectedJobId(jobId);
    setShowBids(true);
  };

  return (
    <div>
      <h1>Job list</h1>
      {loading ? (
        <p>LOading the jobs...</p>
      ) : jobs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Deadline</th>
              <th>Max bid</th>
              <th>View bids</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.description}</td>
                <td>{job.deadline}</td>
                <td>{job.maxBidValue}</td>
                <td>
                  <button
                    onClick={() => handleViewBids(job.id)} 
                  >
                    View Bids
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No jobs yet.</p>
      )}

      {showBids && selectedJobId && (
        <div className="bids-modal">
          <h2>Bids for job {selectedJobId}</h2>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Price</th>
                <th>Details</th>
                <th>Accept bid</th>
              </tr>
            </thead>
            <tbody>
              {selectedJobBids.map((bid, index) => (
                <tr key={index}>
                  <td>{bid.serviceProviderAddress}</td>
                  <td>{ethers.formatUnits(bid.price, "ether")}</td>
                  <td>{bid.details}</td>
                  <td>
                    <button
                    >
                      Accept bid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowBids(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ViewJobsPage;

