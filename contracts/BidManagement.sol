// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

import "./UserManagement.sol";

contract BidManagement is UserManagement {

    struct Bid {
        uint jobId;
        uint price;
        string details;
        address serviceProviderAddress;
        bool isAccepted;
    }

    // each provider can place one bid per job, more providers can place a bid on a job
    mapping(uint => mapping(address =>Bid)) public jobBids;
    mapping (uint => address[]) public jobBidders; // array with all job bidders

    event BidPlaced(uint indexed jobId, address indexed serviceProvider, uint price, string details);
    event BidAccepted(uint indexed jobId, address indexed serviceProvider, uint price);

    modifier onlyClient() {
        require(users[msg.sender].role == Role.Client, "Not Client");
        _;
    }

    // allow a provider to place a bid
    function placeBid(uint _jobId, uint _price, string memory _details) public onlyServiceProvider {
        require(_price > 0, "Bid price must be greater than zero");
        require(bytes(_details).length > 0, "Details cannot be empty");
        require(jobBids[_jobId][msg.sender].price == 0, "Provider already placed a bid");
          
        jobBids[_jobId][msg.sender] = Bid({
            jobId: _jobId,
            price: _price,
            details: _details,
            serviceProviderAddress: msg.sender,
            isAccepted: false
        });

        jobBidders[_jobId].push(msg.sender);

        emit BidPlaced(_jobId, msg.sender, _price, _details);
    }

    // allow a client to accept a bid
    function acceptBid(uint _jobId, address _serviceProvider) external payable onlyClient {
        require(msg.value > 0, "Payment required");
        require(jobBids[_jobId][_serviceProvider].price > 0, "Bid not found");
        require(jobBids[_jobId][_serviceProvider].isAccepted == false, "Bid already accepted");

        jobBids[_jobId][_serviceProvider].isAccepted = true;

        uint bidAmount = jobBids[_jobId][_serviceProvider].price;

        require(msg.value >= bidAmount, "Insufficient payment");

        // paying 
        payable(_serviceProvider).transfer(bidAmount);

        emit BidAccepted(_jobId, _serviceProvider, bidAmount);
    }

    // get the bids for a job
    function getBids(uint _jobId) public view returns (Bid[] memory) {
        uint jobBiddersLen = jobBidders[_jobId].length;
        Bid[] memory bids = new Bid[](jobBiddersLen);
        
        for(uint256 i = 0; i < jobBiddersLen; i++)
        {
            address _serviceProviderAddress = jobBidders[_jobId][i];
            bids[i]=jobBids[_jobId][_serviceProviderAddress];
        }

        return bids;
    }
}
