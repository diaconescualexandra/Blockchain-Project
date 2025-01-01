// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./BidManagement.sol";

contract JobManagement is BidManagement {

    enum JobStatus { Open, Closed }

    struct Job {
        uint id;
        string description;
        uint deadline;
        uint maxBidValue;
        address clientAddress;
        JobStatus status;
        address selectedServiceProvider;
    }

    mapping(address => Job[]) public jobs;

    uint private jobCounter;

    event JobCreated(address indexed client, uint jobId, string description, uint deadline, uint maxBidValue);
    event JobStatusUpdated(address indexed client, uint jobId, JobStatus status);

    // Create a job
    function createJob(string memory _description, uint _deadline, uint _maxBidValue) public onlyClient {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_maxBidValue > 0, "Max bid value must be greater than zero");

        jobCounter++;
        jobs[msg.sender].push(Job(jobCounter, _description, _deadline, _maxBidValue, msg.sender, JobStatus.Open, address(0)));

        emit JobCreated(msg.sender, jobCounter, _description, _deadline, _maxBidValue);
    }

    // Accepting a bid
    function acceptBidFromServiceProvider(uint _jobId, address _serviceProvider) public onlyClient {
        BidManagement.acceptBid(_jobId, _serviceProvider);
        
        // update the job (open -> closed)
        Job[] storage clientJobs = jobs[msg.sender];
        for (uint i = 0; i < clientJobs.length; i++) {
            if (clientJobs[i].id == _jobId) {
                clientJobs[i].status = JobStatus.Closed;
                clientJobs[i].selectedServiceProvider = _serviceProvider;
                break;
            }
        }

        emit JobStatusUpdated(msg.sender, _jobId, JobStatus.Closed);
    }
}
