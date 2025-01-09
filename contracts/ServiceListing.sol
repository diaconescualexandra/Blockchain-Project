// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

import "./UserManagement.sol";

contract ServiceListing is UserManagement {

    struct Service {
        string description;
        address serviceProviderAddress;
    }

    mapping(address => Service[]) public listings;

    //service providers can add multiple services
    function addService (string memory _description) internal onlyServiceProvider
    {
        listings[msg.sender].push(Service(_description, msg.sender));
    }
}