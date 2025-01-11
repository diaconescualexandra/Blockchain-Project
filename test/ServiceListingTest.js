const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ServiceListing", function () {
    let serviceListing, owner, client, serviceProvider;

    beforeEach(async function () {
        [owner, client, serviceProvider] = await ethers.getSigners();

        const ServiceListing = await ethers.getContractFactory("ServiceListing");
        serviceListing = await ServiceListing.deploy();
        await serviceListing.waitForDeployment();

        await serviceListing.setUser("serviceProvider", 34, serviceProvider.address, 0);
        await serviceListing.setUser("client", 34, client.address, 1);

    });

    it("Should return new service", async function () {
        const serviceDescription = "web development";
        const providerAddresss = serviceProvider.address;

        await serviceListing.connect(serviceProvider).addServiceTest(serviceDescription);

        
        const newListing = await serviceListing.listings(providerAddresss, 0);
        expect(newListing.description).to.equal(serviceDescription);
        expect(newListing.serviceProviderAddress).to.equal(providerAddresss);


    });


    //modifiers
    it("should return not service provider", async function () {

        const addServiceAsClient = serviceListing.connect(client);
        await expect(addServiceAsClient.addServiceTest("web development")).to.be.revertedWith("Not Service Provider");
    });


});
