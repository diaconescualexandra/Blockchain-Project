// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

import "./UserManagement.sol";
import "./JobManagement.sol";

contract EscrowService {

    enum State {in_progress, completed}

    struct Agreement {
        address client;
        address serviceProvider;
        uint amountWithCommission;
        uint amountWithoutCommission;
        State state;    
        } 

    uint public platformMoneyFromCommission;

    event AgreementCreated(address indexed client, address indexed serviceProvider, uint amount);
    event FundsDeposited (uint indexed agreementId, address indexed client, address indexed serviceProvider, uint amount);
    event FundsReleased (uint indexed agreementId, address indexed client, address indexed serviceProvider, uint amount);
    event FundsWithdrawn (uint indexed agreementId, address indexed client, address indexed serviceProvider, uint amount);

    UserManagement userManagement;
    JobManagement jobManagement;

    constructor (address _userManagementAdd, address _jobManagementAdd)
    {
        userManagement = UserManagement(_userManagementAdd);
        jobManagement = JobManagement(_jobManagementAdd);
    }

    mapping(uint => Agreement) public agreements;
    mapping(address => uint) public withdrawableBalances;
    mapping(uint => uint) public depositedFunds; // funds deposited for each agreement

    uint public agreementCount;

    Agreement public agreement;

    modifier onlyParts(uint agreementId)
    {
        require(agreements[agreementId].client == msg.sender || agreements[agreementId].serviceProvider == msg.sender, "not participants in this agreement" );
        _;
    }

    function newAgreement(address _client, address _serviceProvider, uint _amountWithCommission, uint _amountWithoutCommission) external 
    returns (uint)
    {

        require(userManagement.getUserRole(_client) == UserManagement.Role.Client, "Only client can be part of an agreement" );
        require(userManagement.getUserRole(_serviceProvider) == UserManagement.Role.ServiceProvider, "Only service providers can be part of an agreement" );

        agreementCount ++;
        agreements[agreementCount] = Agreement(_client, _serviceProvider, _amountWithCommission,_amountWithoutCommission, State.in_progress);

        emit AgreementCreated(_client, _serviceProvider, _amountWithCommission);

        return agreementCount;

    }

    modifier onlyClient() {
        require(userManagement.getUserRole(msg.sender)==UserManagement.Role.Client, "Not client");
        _;
    }

    function depositFunds(uint _agreementId, uint _jobId) public onlyClient() payable {
        JobManagement.Job memory jobb = jobManagement.getJobById(_jobId);
        require(jobb.escrowServiceId == _agreementId, "Agreement not found");
        require(agreements[_agreementId].state == State.in_progress, "aggrement is not in progress");
        require(msg.value == agreements[_agreementId].amountWithCommission, "amount sent doesn't match the bid price");

        depositedFunds[_agreementId] += msg.value;
        
        emit FundsDeposited(_agreementId, msg.sender,jobb.selectedServiceProvider, msg.value);
    }

    function releaseFunds(uint _agreementId) public onlyParts(_agreementId) {
        require(agreements[_agreementId].state == State.in_progress, "aggrement is not in progress");
        require(agreements[_agreementId].amountWithCommission <= depositedFunds[_agreementId], "Insufficient funds");

        //transfer funds to service provider using withdrawal pattern
        withdrawableBalances[agreements[_agreementId].serviceProvider] += agreements[_agreementId].amountWithoutCommission;
        //platform gets its money
        platformMoneyFromCommission += agreements[_agreementId].amountWithCommission - agreements[_agreementId].amountWithoutCommission;
        agreements[_agreementId].state = State.completed;

        emit FundsReleased(_agreementId, msg.sender, agreements[_agreementId].serviceProvider, agreements[_agreementId].amountWithoutCommission);
    }


    function withdraw(uint _agreementId) public onlyParts(_agreementId){
        require(withdrawableBalances[msg.sender] > 0, "No funds found");
        require(agreements[_agreementId].state == State.completed, "aggrement is not completed"); //doesnt allow refunds
        uint balance = withdrawableBalances[msg.sender] ;

        withdrawableBalances[msg.sender] = 0; //withdrawal pattern; prevent reentrancy

        (bool callSuccess, ) = payable(msg.sender).call{value: balance}(""); //eth transfer example 
        require(callSuccess, "Transfer failed");

        emit FundsWithdrawn(_agreementId, agreements[_agreementId].client, agreements[_agreementId].serviceProvider, balance);
    }

    //retrieve the temporary jobmanagement address
    function updateJobManagementAddress(address _newJobManagementAdd) external {
        jobManagement = JobManagement(_newJobManagementAdd);
    }

    function testSetDepositedFunds(uint _agreementId, uint _amount) public onlyClient() {
    depositedFunds[_agreementId] = _amount;
}

}