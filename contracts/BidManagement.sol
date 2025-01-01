// SPDX-License-Identifier: GPL-3.0
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

    // Mapping for stocking bids for every job
    mapping(uint => Bid[]) public jobBids;

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

        jobBids[_jobId].push(Bid({
            jobId: _jobId,
            price: _price,
            details: _details,
            serviceProviderAddress: msg.sender,
            isAccepted: false
        }));

        emit BidPlaced(_jobId, msg.sender, _price, _details);
    }

    // allow a client to accept a bid
    function acceptBid(uint _jobId, address _serviceProvider) public payable onlyClient {
        require(msg.value > 0, "Payment required");

        Bid[] storage bids = jobBids[_jobId];
        bool validBid = false;
        uint bidAmount = 0;

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].serviceProviderAddress == _serviceProvider && !bids[i].isAccepted) {
                validBid = true;
                bidAmount = bids[i].price;
                bids[i].isAccepted = true;
                break;
            }
        }

        require(validBid, "Bid not found or already accepted");
        require(msg.value >= bidAmount, "Insufficient payment");

        // paying 
        payable(_serviceProvider).transfer(bidAmount);

        emit BidAccepted(_jobId, _serviceProvider, bidAmount);
    }

    // get the bids for a job
    function getBids(uint _jobId) public view returns (Bid[] memory) {
        return jobBids[_jobId];
    }
}
