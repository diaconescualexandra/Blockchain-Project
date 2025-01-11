const { ethers } = require("hardhat");

async function deploy() { 
    [owner, client, serviceProvider] = await ethers.getSigners();

    let UserManagement = await ethers.getContractFactory("UserManagement");
    let userManagement = await UserManagement.deploy();
    await userManagement.waitForDeployment(); 

    let BidManagement = await ethers.getContractFactory("BidManagement");
    let bidManagement = await BidManagement.deploy();
    await bidManagement.waitForDeployment();

    let ServiceListing = await ethers.getContractFactory("ServiceListing");
    let serviceListing = await ServiceListing.deploy();
    await serviceListing.waitForDeployment();

    let dummyAddressJobManagement = "0x0000000000000000000000000000000000000001";

    let EscrowService = await ethers.getContractFactory("EscrowService");
    let escrowService = await EscrowService.deploy(
        await userManagement.getAddress(), 
        dummyAddressJobManagement
    );
    await escrowService.waitForDeployment(); 

    let JobManagement = await ethers.getContractFactory("JobManagement");
    let jobManagement = await JobManagement.deploy(
        await escrowService.getAddress(), 
        await userManagement.getAddress()
    );
    await jobManagement.waitForDeployment();

    await escrowService.updateJobManagementAddress(await jobManagement.getAddress());

    await userManagement.connect(serviceProvider).setUserRole(serviceProvider.address,0);
    await userManagement.connect(client).setUserRole(client.address,1);

    console.log("UserManagement Contract Address:", await userManagement.getAddress()); 
    console.log("BidManagement Contract Address:", await bidManagement.getAddress());
    console.log("ServiceListing Contract Address:", await serviceListing.getAddress());
    console.log("EscrowService Contract Address:", await escrowService.getAddress());
    console.log("JobManagement Contract Address:", await jobManagement.getAddress());
    console.log("user role", await userManagement.getUserRole(client.address));
    console.log("service prov role", await userManagement.getUserRole(serviceProvider.address));
    

    console.log("Deployment successful!")
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });