const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("UserManagement", function () {
    let contract;
    let owner, userWallet;

    beforeEach(async function () {
        // Get signers
        [owner, userWallet] = await ethers.getSigners();

        // Deploy the contract
        const UserManagement = await ethers.getContractFactory("UserManagement");
        contract = await UserManagement.deploy();
        await contract.waitForDeployment();
    });

    it("Should return the new user", async function () {
        const userName = "andrei";
        const userAge = 34;
        const userRole = 1; // Client role
        await contract.setUser(userName, userAge, userWallet.address, userRole);

        // Retrieve the user
        const user = await contract.users(userWallet.address);

        // Verify the user data
        expect(user.name).to.equal(userName);
        expect(Number(user.age)).to.equal(userAge); // Convert BigInt to Number
        expect(user.walletAddress).to.equal(userWallet.address);
        expect(Number(user.role)).to.equal(userRole); // Convert BigInt to Number
    });

    it("Should return the correct user role", async function () {
        const userRole = 1; // Client role
        await contract.setUser("andrei", 34, userWallet.address, userRole);

        const role = await contract.getUserRole(userWallet.address);
        expect(Number(role)).to.equal(userRole); // Convert BigInt to Number
    });
});