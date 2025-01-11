const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("EscrowService", function () {
    let escrowService, owner, client, serviceProvider;
    let userManagement, jobManagement;

    beforeEach(async function () {
        [owner, client, serviceProvider] = await ethers.getSigners();
    
        const UserManagement = await ethers.getContractFactory("UserManagement");
        userManagement = await UserManagement.deploy();
        await userManagement.waitForDeployment();
    
        const EscrowService = await ethers.getContractFactory("EscrowService");
        escrowService = await EscrowService.deploy(
            await userManagement.getAddress(),
            "0x0000000000000000000000000000000000000001"
        );
        await escrowService.waitForDeployment();
    
        const JobManagement = await ethers.getContractFactory("JobManagement");
        jobManagement = await JobManagement.deploy(
            await escrowService.getAddress(),
            await userManagement.getAddress());
        await jobManagement.waitForDeployment();
    
        await escrowService.updateJobManagementAddress(await jobManagement.getAddress());
    
        await userManagement.setUser("serviceProvider", 34, await serviceProvider.getAddress(), 0); 
        await userManagement.setUser("client", 34, await client.getAddress(), 1); 

    });
    

    it("should create a new agreement", async function () {
        const amountWithCommissionTest = 101;
        const amountWithoutCommissionTest = 100;
        const stateTest = 0;

        const newAgreementId = await escrowService.connect(client).newAgreement(
            await client.getAddress(),
            await serviceProvider.getAddress(), 
            amountWithCommissionTest, 
            amountWithoutCommissionTest
        );

        await newAgreementId.wait();

        await expect(newAgreementId)
            .to.emit(escrowService, "AgreementCreated")
            .withArgs(
                await client.getAddress(), 
                await serviceProvider.getAddress(), 
                amountWithCommissionTest
            );

        const agreementId = await escrowService.agreementCount();
        const newAgreement = await escrowService.agreements(agreementId);

        expect(newAgreement.client).to.equal(await client.getAddress());
        expect(newAgreement.serviceProvider).to.equal(await serviceProvider.getAddress());
        expect(Number(newAgreement.amountWithCommission)).to.equal(amountWithCommissionTest);
        expect(Number(newAgreement.amountWithoutCommission)).to.equal(amountWithoutCommissionTest);
        expect(Number(newAgreement.state)).to.equal(stateTest);
    });

    it("should allow client to create a job with valid deadline", async function () {
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7; // 7 days in the future
    
        await expect(
            jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000)
        ).to.not.be.reverted;
    
        // Verify the job details
        const job = await jobManagement.jobs(client.address, 0);
        expect(job.description).to.equal("design website");
        expect(job.deadline).to.equal(futureTimestamp);
        expect(job.maxBidValue).to.equal(4000);
    });

    it("should deposit funds", async function () {
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7;
    
        await jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000);
    
        await jobManagement.connect(serviceProvider).placeBid(1, 4000, "High-quality design work"); 
    
        await expect(
            jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address, { value: 4000 })
        ).to.emit(jobManagement, "JobStatusUpdated")
          .withArgs(client.address, 1, 1); // job acceptBidFromServiceProvider
    
        //deposit from escrow
        const agreeementPriceWithCommissionTest = 4400; 
        await expect(
            escrowService.connect(client).depositFunds(1, 1, { value: agreeementPriceWithCommissionTest })
        ).to.emit(escrowService, "FundsDeposited")
          .withArgs(1, client.address, serviceProvider.address, agreeementPriceWithCommissionTest);
    
        const depositedFundsTest = await escrowService.depositedFunds(1);
        expect(depositedFundsTest).to.equal(agreeementPriceWithCommissionTest);
    });
    
    it("should release funds", async function () {
        const agreementPriceWithCommissionTest = 4400;
        const agreementPriceWithoutCommissionTest = 4000;
        const agreementIdTest = 1;
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7;
        
        await jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000);

        await jobManagement.connect(serviceProvider).placeBid(1, 4000, "High-quality design work"); 
    
        await expect(
            jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address, { value: 4000 })
        ).to.emit(jobManagement, "JobStatusUpdated")
          .withArgs(client.address, 1, 1); // job acceptBidFromServiceProvider

        await escrowService.connect(client).newAgreement(
            await client.getAddress(),
            await serviceProvider.getAddress(), 
            agreementPriceWithCommissionTest, 
            agreementPriceWithoutCommissionTest
        );

        await escrowService.connect(client).depositFunds(agreementIdTest, 1, { value: agreementPriceWithCommissionTest });

        await expect(
            escrowService.connect(client).releaseFunds(1)
        ).to.emit(escrowService, "FundsReleased")
          .withArgs(1, client.address, serviceProvider.address, agreementPriceWithoutCommissionTest);

          const withdrawableBalancesTest = await escrowService.withdrawableBalances(serviceProvider.address);
          expect(withdrawableBalancesTest).to.equal(agreementPriceWithoutCommissionTest);

          const platformMoneyFromCommissionTest = await escrowService.platformMoneyFromCommission();
          expect(platformMoneyFromCommissionTest).to.equal(agreementPriceWithCommissionTest-agreementPriceWithoutCommissionTest);

          const agreementStateTest = await escrowService.agreements(1);
          expect(Number(agreementStateTest.state)).to.equal(1);
    });

    //deposit function require : amount sent to be equal to the bid price
    it("should revert amount sent doesn't match the bid price", async function () {
        const agreementPriceWithCommissionTest = 4000;
        const agreementPriceWithoutCommissionTest = 4400;
        const amountTest = 900;
        const agreementIdTest = 1;
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7;
        
        await jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000);

        await jobManagement.connect(serviceProvider).placeBid(1, 4000, "High-quality design work"); 
    
        await expect(
            jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address, { value: 4000 })
        ).to.emit(jobManagement, "JobStatusUpdated")
          .withArgs(client.address, 1, 1); // job acceptBidFromServiceProvider

          await escrowService.connect(client).newAgreement(
            await client.getAddress(),
            await serviceProvider.getAddress(), 
            agreementPriceWithCommissionTest, 
            agreementPriceWithoutCommissionTest
        );

        await expect(escrowService.connect(client).depositFunds(agreementIdTest, 1, { value: amountTest }))
        .to.be.revertedWith("amount sent doesn't match the bid price");
    });

    it("should withdraw funds", async function () {
        const agreementPriceWithCommissionTest = 4400;
        const agreementPriceWithoutCommissionTest = 4000;
        const agreementIdTest = 1;
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7;
        
        await jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000);
        await jobManagement.connect(serviceProvider).placeBid(1, 4000, "High-quality design work");
        await jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address, { value: 4000 });
    
        await escrowService.connect(client).newAgreement(
            await client.getAddress(),
            await serviceProvider.getAddress(), 
            agreementPriceWithCommissionTest, 
            agreementPriceWithoutCommissionTest
        );
    
        await escrowService.connect(client).depositFunds(agreementIdTest, 1, { value: agreementPriceWithCommissionTest });
    
        await escrowService.connect(client).releaseFunds(agreementIdTest);
    
        await expect(
            escrowService.connect(serviceProvider).withdraw(1)  
        ).to.emit(escrowService, "FundsWithdrawn")
          .withArgs(1, client.address, serviceProvider.address, agreementPriceWithoutCommissionTest);
    
        const withdrawableBalancesTest = await escrowService.withdrawableBalances(serviceProvider.address); 
        expect(withdrawableBalancesTest).to.equal(0);

        const agreementStateTest = await escrowService.agreements(1);
        expect(Number(agreementStateTest.state)).to.equal(1);
    });

    it("should revert no funds found", async function () {
        const agreementPriceWithCommissionTest = 4400;
        const agreementPriceWithoutCommissionTest = 4000;
        const agreementIdTest = 1;
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const futureTimestamp = currentTimestamp + 60 * 60 * 24 * 7;
        
        await jobManagement.connect(client).createJobTest("design website", futureTimestamp, 4000);
        await jobManagement.connect(serviceProvider).placeBid(1, 4000, "High-quality design work");
        await jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address, { value: 4000 });
    
        await escrowService.connect(client).newAgreement(
            await client.getAddress(),
            await serviceProvider.getAddress(), 
            agreementPriceWithCommissionTest, 
            agreementPriceWithoutCommissionTest
        );
    
        await escrowService.connect(client).depositFunds(agreementIdTest, 1, { value: agreementPriceWithCommissionTest });

        await expect(escrowService.connect(client).withdraw(agreementIdTest))
        .to.be.revertedWith("No funds found");

    });


});