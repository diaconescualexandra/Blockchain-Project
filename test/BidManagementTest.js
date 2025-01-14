const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BidManagement", function () {
    let contract, owner, serviceProvider, client, anotherServiceProvider;

    beforeEach(async function () {
        // get signers
        [owner, serviceProvider, client, anotherServiceProvider] = await ethers.getSigners();
    
        // deploy the contract
        const BidManagement = await ethers.getContractFactory("BidManagement");
        contract = await BidManagement.deploy();
    
        // register users
        await contract.connect(serviceProvider).setUser("ServiceProvider", 30, serviceProvider.address, 0); 
        await contract.connect(client).setUser("Client", 40, client.address, 1); 
    });
    
    
    it("Should allow a service provider to place a bid", async function () {
        const jobId = 1;
        const bidPrice = 100;
        const bidDetails = "We offer great service.";
    
        // place a bid
        await contract.connect(serviceProvider).placeBid(jobId, bidPrice, bidDetails);
    
        // retrieve the bid
        const bid = await contract.jobBids(jobId, serviceProvider.address);
    
        // verify the bid details
        expect(bid.jobId).to.equal(BigInt(jobId)); 
        expect(bid.price).to.equal(BigInt(bidPrice)); 
        expect(bid.details).to.equal(bidDetails);
        expect(bid.serviceProviderAddress).to.equal(serviceProvider.address);
        expect(bid.isAccepted).to.be.false;
    });
    

    it("Should prevent a service provider from placing multiple bids for the same job", async function () {
        const jobId = 1;
        const bidPrice = 100;
        const bidDetails = "We offer great service.";

        
        await contract.connect(serviceProvider).placeBid(jobId, bidPrice, bidDetails);

        // attempt to place another bid for the same job
        await expect(
            contract.connect(serviceProvider).placeBid(jobId, 200, "New bid details")
        ).to.be.revertedWith("Provider already placed a bid");
    });

    it("Should allow a client to accept a bid", async function () {
        const jobId = 1;
        const bidPrice = 100;
        const bidDetails = "We offer great service.";

        
        await contract.connect(serviceProvider).placeBid(jobId, bidPrice, bidDetails);

        // accept the bid
        await expect(
            contract.connect(client).acceptBid(jobId, serviceProvider.address, { value: bidPrice })
        )
            .to.emit(contract, "BidAccepted")
            .withArgs(jobId, serviceProvider.address, bidPrice);

        // verify the bid is marked as accepted
        const bid = await contract.jobBids(jobId, serviceProvider.address);
        expect(bid.isAccepted).to.be.true;
    });

    it("Should prevent a client from accepting a bid with insufficient payment", async function () {
        const jobId = 1;
        const bidPrice = 100;
        const bidDetails = "We offer great service.";

        
        await contract.connect(serviceProvider).placeBid(jobId, bidPrice, bidDetails);

        await expect(
            contract.connect(client).acceptBid(jobId, serviceProvider.address, { value: 50 })
        ).to.be.revertedWith("amount sent doesn't match the bid price");
    });

    it("Should prevent accepting a non-existent bid", async function () {
        const jobId = 1;

        // attempt to accept a non-existent bid
        await expect(
            contract.connect(client).acceptBid(jobId, serviceProvider.address, { value: 100 })
        ).to.be.revertedWith("Bid not found");
    });

    it("Should return all bids for a specific job", async function () {
        const jobId = 1;
    
        // place multiple bids
        await contract.connect(serviceProvider).placeBid(jobId, 100, "We offer great service.");
        await contract.connect(anotherServiceProvider).setUser("AnotherProvider", 35, anotherServiceProvider.address, 0);
        await contract.connect(anotherServiceProvider).placeBid(jobId, 200, "We provide better service.");
    
        // retrieve all bids for the job
        const bids = await contract.getBids(jobId);
    
        expect(bids.length).to.equal(2);
    
        expect(bids[0].jobId).to.equal(BigInt(jobId));
        expect(bids[0].price).to.equal(BigInt(100));
        expect(bids[0].details).to.equal("We offer great service.");
        expect(bids[0].serviceProviderAddress).to.equal(serviceProvider.address);
        expect(bids[0].isAccepted).to.be.false;
    
        expect(bids[1].jobId).to.equal(BigInt(jobId));
        expect(bids[1].price).to.equal(BigInt(200));
        expect(bids[1].details).to.equal("We provide better service.");
        expect(bids[1].serviceProviderAddress).to.equal(anotherServiceProvider.address);
        expect(bids[1].isAccepted).to.be.false;
    });
    
});
