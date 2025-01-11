const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("UserManagement", function () {
    let userManagement;
    let owner, userWallet;

    beforeEach(async function () {
        // Get signers
        [owner, userWallet] = await ethers.getSigners();

        // Deploy the contract
        const UserManagement = await ethers.getContractFactory("UserManagement");
        userManagement = await UserManagement.deploy();
        await userManagement.waitForDeployment();
    });

    it("Should return the new user", async function () {
        const userName = "andrei";
        const userAge = 34;
        const userRole = 1; // Client role
        await userManagement.setUser(userName, userAge, userWallet.address, userRole);

        const user = await userManagement.users(userWallet.address);

        expect(user.name).to.equal(userName);
        expect(Number(user.age)).to.equal(userAge); // Convert BigInt to Number
        expect(user.walletAddress).to.equal(userWallet.address);
        expect(Number(user.role)).to.equal(userRole); 
    });

    it("Should return the correct user role", async function () {
        const userRole = 1; // Client role
        await userManagement.setUser("andrei", 34, userWallet.address, userRole);

        const role = await userManagement.getUserRole(userWallet.address);
        expect(Number(role)).to.equal(userRole); 
    });

});