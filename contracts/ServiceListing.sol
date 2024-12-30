pragma solidity >=0.7.0 <0.9.0;

import "./UserManagement.sol";

contract ServiceListing is UserManagement {

    struct Service {
        string description;
        uint price;
        address serviceProviderAddress;
    }

    mapping(address => Service[]) public listings;

    //service providers can add multiple services
    function addService (string memory _description, uint _price) public onlyServiceProvider
    {
        listings[msg.sender].push(Service(_description, _price, msg.sender));
    }
}