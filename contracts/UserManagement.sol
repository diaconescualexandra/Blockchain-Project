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

    //registering a user
    function setUser (string memory _name, uint _age, address _walletAddress, uint _role) public {
        users [_walletAddress] = User (_name, _age, _walletAddress, Role(_role));
    }

    modifier onlyServiceProvider() {
        require(users[msg.sender].role == Role.ServiceProvider, "Not Service Provider" );
        _;
    }

}