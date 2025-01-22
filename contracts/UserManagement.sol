// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

contract UserManagement {

    enum Role {ServiceProvider, Client}

    struct User {
        string name;
        uint age;
        address walletAddress;
        Role role;
    }

    mapping (address => User ) public users;

    event UserAdded(string name, address indexed walletAddress, uint role );

    //registering a user
    function setUser (string memory _name, uint _age, address _walletAddress, uint _role) public {
        users [_walletAddress] = User (_name, _age, _walletAddress, Role(_role));
        emit UserAdded(_name, _walletAddress, _role);
    }

    modifier onlyServiceProvider() {
        require(users[msg.sender].role == Role.ServiceProvider, "Not Service Provider" );
        _;
    }

    modifier onlyClient() virtual{
        require(users[msg.sender].role == Role.Client, "Not Client");
        _;
    }

    function getUserRole (address userAdd) public view returns (Role)
    {
        return users[userAdd].role;
    }

    function setUserRole(address _userAddress, Role _role) public {
        require(msg.sender == _userAddress, "Only the user can set their own role"); 
        users[_userAddress].role = _role; 
    }


}