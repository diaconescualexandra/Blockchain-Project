const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("JobManagement", function () {
    let userManagement;
    let jobManagement;
    let escrowService;
    let  client,client2,client3, serviceProvider;

  beforeEach(async function () {
    [client,client2,client3, serviceProvider] = await ethers.getSigners();

    const UserManagement = await ethers.getContractFactory("UserManagement");
    userManagement = await UserManagement.deploy();
    await userManagement.waitForDeployment();
    const EscrowService = await ethers.getContractFactory("EscrowService");
    escrowService = await EscrowService.deploy(userManagement.target, "0x0000000000000000000000000000000000000001");
    await escrowService.waitForDeployment();
    
    const JobManagement = await ethers.getContractFactory("JobManagement");
    jobManagement = await JobManagement.deploy(escrowService.target, userManagement.target);
    await jobManagement.waitForDeployment();
    await escrowService.updateJobManagementAddress(jobManagement.target);
    // register users (client and service provider)
    await userManagement.connect(client).setUser("Client", 30, client.address, 1); 
    await userManagement.connect(client2).setUser("Client", 31, client2.address, 1);
    await userManagement.connect(client3).setUser("Client", 33, client3.address, 1);
    await userManagement.connect(serviceProvider).setUser("ServiceProvider", 30, serviceProvider.address, 0); 
});

    it("Should allow a client to create a job", async function () {
      const description = "Fixing the roof";
      const deadline = Math.floor(Date.now() / 1000) + 3600; 
      const maxBidValue = ethers.parseEther("1");
      
      await jobManagement.connect(client).createJobTest(description, deadline, maxBidValue);

      const job = await jobManagement.getJobById(1);
      expect(job.id).to.equal(1);
      expect(job.description).to.equal(description);
      expect(job.deadline).to.equal(deadline);
      expect(job.maxBidValue).to.equal(maxBidValue);
      expect(job.clientAddress).to.equal(client.address);
      expect(job.status).to.equal(0);  // Open status
    });
    it("Should fail if the deadline is in the past", async function () {
      const description = "Fixing the roof";
      const deadline = Math.floor(Date.now() / 1000) - 3600; 
      const maxBidValue = ethers.parseEther("1");

      await expect(
        jobManagement.connect(client).createJob(description, deadline, maxBidValue)
      ).to.be.revertedWith("Deadline must be in the future");
    });

    it("Should allow the client to accept a bid from a service provider", async function () {
      const description = "Fixing the roof";
      const deadline = Math.floor(Date.now() / 1000) + 3600; 
      const maxBidValue = ethers.parseEther("1");
      const jobId = 1;
      const bidDetails = "We offer great service.";

      await jobManagement.connect(client).createJob(description, deadline, maxBidValue);
      await jobManagement.connect(serviceProvider).placeBid(jobId, maxBidValue, bidDetails);
      // assume service provider has placed a bid 
      await jobManagement.connect(client).acceptBidFromServiceProvider(1, serviceProvider.address,{
        value: maxBidValue
      });

      const job = await jobManagement.getJobById(1);
      expect(job.status).to.equal(1); // job status should be "Closed"
      expect(job.selectedServiceProvider).to.equal(serviceProvider.address);
    });
      it("Should return job details by ID", async function () {
        const description = "Fixing the roof";
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const maxBidValue = ethers.parseEther("1");
  
        await jobManagement.connect(client).createJob(description, deadline, maxBidValue);
        const job = await jobManagement.getJobById(1);
  
        expect(job.id).to.equal(1);
        expect(job.description).to.equal(description);
        expect(job.deadline).to.equal(deadline);
        expect(job.maxBidValue).to.equal(maxBidValue);
        expect(job.clientAddress).to.equal(client.address);
      });

      it("should allow clients to create jobs and fetch all jobs", async function () {
        await jobManagement
          .connect(client)
          .createJobTest("Job 1 Description", Math.floor(Date.now() / 1000) + 3600, ethers.parseEther("1"));
    
        await jobManagement
          .connect(client2)
          .createJobTest("Job 2 Description", Math.floor(Date.now() / 1000) + 7200, ethers.parseEther("2"));
    
        await jobManagement
          .connect(client3)
          .createJobTest("Job 3 Description", Math.floor(Date.now() / 1000) + 10800, ethers.parseEther("3"));
    
        const jobs = await jobManagement.getAllJobs();
    
        expect(jobs.descriptions[0]).to.equal("Job 1 Description");
        expect(jobs.descriptions[1]).to.equal("Job 2 Description");
        expect(jobs.descriptions[2]).to.equal("Job 3 Description");
        expect(jobs.maxBidValues[0].toString()).to.equal(ethers.parseEther("1").toString());
        expect(jobs.maxBidValues[1].toString()).to.equal(ethers.parseEther("2").toString());
        expect(jobs.maxBidValues[2].toString()).to.equal(ethers.parseEther("3").toString());
      });
    

});
