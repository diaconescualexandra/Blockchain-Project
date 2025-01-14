// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

import "./BidManagement.sol";
import "./EscrowService.sol";

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
        uint escrowServiceId;
    }

    //so that jobmanagement knows which escrowservice to call 
    EscrowService escrowService;
    UserManagement userManagement;
    constructor (address _escrowServiceAdd, address _userManagement)
    {
        escrowService = EscrowService(_escrowServiceAdd);
        userManagement = UserManagement(_userManagement);

    }

    mapping(address => Job[]) public jobs;
    mapping(uint => Job) public jobById;

  

    uint private jobCounter;

    event JobCreated(address indexed client, uint jobId, string description, uint deadline, uint maxBidValue);
    event JobStatusUpdated(address indexed client, uint jobId, JobStatus status);

    modifier onlyClient() override {
        require(userManagement.getUserRole(msg.sender) == UserManagement.Role.Client, "Not Client");
        _;
    }
    // Create a job
    function createJob(string memory _description, uint _deadline, uint _maxBidValue) internal onlyClient {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_maxBidValue > 0, "Max bid value must be greater than zero");

        jobCounter++;
        jobs[msg.sender].push(Job(jobCounter, _description, _deadline, _maxBidValue, msg.sender, JobStatus.Open, address(0), 0));
        jobById[jobCounter] = Job(jobCounter, _description, _deadline, _maxBidValue, msg.sender, JobStatus.Open, address(0), 0);

        emit JobCreated(msg.sender, jobCounter, _description, _deadline, _maxBidValue);
    }

    function createJobTest (string memory _description, uint _deadline, uint _maxBidValue) public {
        createJob(_description, _deadline, _maxBidValue);
    }

    // Accepting a bid
    function acceptBidFromServiceProvider(uint _jobId, address _serviceProvider) public payable onlyClient {
        acceptBid(_jobId, _serviceProvider);
        uint bidPrice = jobBids[_jobId][_serviceProvider].price;
        uint bidPriceWithCommission = priceWithCommission(bidPrice, 10); //10% commission

       uint agreementId = escrowService.newAgreement(msg.sender, _serviceProvider, bidPriceWithCommission, bidPrice); 

        // update the job (open -> closed)
        Job[] storage clientJobs = jobs[msg.sender];
        for (uint i = 0; i < clientJobs.length; i++) {
            if (clientJobs[i].id == _jobId) {
                clientJobs[i].status = JobStatus.Closed;
                clientJobs[i].escrowServiceId = agreementId; //store the escrow service id for the job
                clientJobs[i].selectedServiceProvider = _serviceProvider;
                jobById[_jobId] = clientJobs[i];
                break;
            }
        }
        
        emit JobStatusUpdated(msg.sender, _jobId, JobStatus.Closed);
    }

    //get job by id
    function getJobById(uint _jobId) external view returns (Job memory) {
        return jobById[_jobId];
    }
  
    function getAllJobs() external view returns (
        string[] memory descriptions,
        uint[] memory deadlines,
        uint[] memory maxBidValues
    ) {
        uint totalJobCount = jobCounter;

        descriptions = new string[](totalJobCount);
        deadlines = new uint[](totalJobCount);
        maxBidValues = new uint[](totalJobCount);

        uint index = 0;

        for (uint i = 1; i <= totalJobCount; i++) {
            if (jobById[i].id == 0) {
                continue; 
            }
            Job storage job = jobById[i];
            descriptions[index] = job.description;
            deadlines[index] = job.deadline;
            maxBidValues[index] = job.maxBidValue;
            index++;
        }

        return (descriptions, deadlines, maxBidValues);
    }



}
