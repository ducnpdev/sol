const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let VotingContract;
  let votingContract;
  let owner;
  let voter1;
  let voter2;
  let voter3;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, voter1, voter2, voter3, addr1, addr2] = await ethers.getSigners();
    VotingContract = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingContract.owner()).to.equal(owner.address);
    });

    it("Should start with 0 polls", async function () {
      expect(await votingContract.pollCount()).to.equal(0);
    });
  });

  describe("Poll Creation", function () {
    it("Should allow owner to create a poll", async function () {
      const title = "Test Poll";
      const description = "Test Description";
      const startTime = Math.floor(Date.now() / 1000) + 60;
      const endTime = startTime + 3600;
      const options = ["Option 1", "Option 2", "Option 3"];

      await expect(votingContract.connect(owner).createPoll(
        title,
        description,
        startTime,
        endTime,
        options
      )).to.emit(votingContract, "PollCreated")
        .withArgs(1, title, startTime, endTime);

      expect(await votingContract.pollCount()).to.equal(1);
    });

    it("Should not allow non-owner to create a poll", async function () {
      const title = "Test Poll";
      const description = "Test Description";
      const startTime = Math.floor(Date.now() / 1000) + 60;
      const endTime = startTime + 3600;
      const options = ["Option 1", "Option 2"];

      await expect(votingContract.connect(voter1).createPoll(
        title,
        description,
        startTime,
        endTime,
        options
      )).to.be.revertedWithCustomError(votingContract, "OwnableUnauthorizedAccount");
    });

    it("Should require at least 2 options", async function () {
      const title = "Test Poll";
      const description = "Test Description";
      const startTime = Math.floor(Date.now() / 1000) + 60;
      const endTime = startTime + 3600;
      const options = ["Option 1"];

      await expect(votingContract.connect(owner).createPoll(
        title,
        description,
        startTime,
        endTime,
        options
      )).to.be.revertedWith("Must have at least 2 options");
    });

    it("Should require start time in the future", async function () {
      const title = "Test Poll";
      const description = "Test Description";
      const startTime = Math.floor(Date.now() / 1000) - 60; // Past time
      const endTime = startTime + 3600;
      const options = ["Option 1", "Option 2"];

      await expect(votingContract.connect(owner).createPoll(
        title,
        description,
        startTime,
        endTime,
        options
      )).to.be.revertedWith("Start time must be in the future");
    });

    it("Should require end time after start time", async function () {
      const title = "Test Poll";
      const description = "Test Description";
      const startTime = Math.floor(Date.now() / 1000) + 3600;
      const endTime = startTime - 60; // Before start time
      const options = ["Option 1", "Option 2"];

      await expect(votingContract.connect(owner).createPoll(
        title,
        description,
        startTime,
        endTime,
        options
      )).to.be.revertedWith("End time must be after start time");
    });
  });

  describe("Voting", function () {
    let pollId;
    let startTime;
    let endTime;

    beforeEach(async function () {
      startTime = Math.floor(Date.now() / 1000) + 120;
      endTime = startTime + 3600;
      
      await votingContract.connect(owner).createPoll(
        "Test Poll",
        "Test Description",
        startTime,
        endTime,
        ["Option 1", "Option 2", "Option 3"]
      );
      pollId = 1;
    });

    it("Should allow voting on active polls", async function () {
      // Wait for poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).vote(pollId, 0))
        .to.emit(votingContract, "VoteCast")
        .withArgs(pollId, voter1.address, 0);

      const pollInfo = await votingContract.getPollInfo(pollId);
      expect(pollInfo.totalVotes).to.equal(1);
      expect(pollInfo.voteCounts[0]).to.equal(1);
    });

    it("Should not allow voting before poll starts", async function () {
      await expect(votingContract.connect(voter1).vote(pollId, 0))
        .to.be.revertedWith("Poll has not started");
    });

    it("Should not allow voting after poll ends", async function () {
      // Wait for poll to end
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).vote(pollId, 0))
        .to.be.revertedWith("Poll has ended");
    });

    it("Should not allow voting twice", async function () {
      // Wait for poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(voter1).vote(pollId, 0);

      await expect(votingContract.connect(voter1).vote(pollId, 1))
        .to.be.revertedWith("Already voted in this poll");
    });

    it("Should not allow voting on non-existent poll", async function () {
      await expect(votingContract.connect(voter1).vote(999, 0))
        .to.be.revertedWith("Poll does not exist");
    });

    it("Should not allow voting on invalid option", async function () {
      // Wait for poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).vote(pollId, 5))
        .to.be.revertedWith("Invalid option");
    });

    it("Should track votes correctly", async function () {
      // Wait for poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(voter1).vote(pollId, 0);
      await votingContract.connect(voter2).vote(pollId, 1);
      await votingContract.connect(voter3).vote(pollId, 0);

      const pollInfo = await votingContract.getPollInfo(pollId);
      expect(pollInfo.totalVotes).to.equal(3);
      expect(pollInfo.voteCounts[0]).to.equal(2);
      expect(pollInfo.voteCounts[1]).to.equal(1);
      expect(pollInfo.voteCounts[2]).to.equal(0);
    });
  });

  describe("Poll Management", function () {
    let pollId;
    let startTime;
    let endTime;

    beforeEach(async function () {
      startTime = Math.floor(Date.now() / 1000) + 120;
      endTime = startTime + 3600;
      
      await votingContract.connect(owner).createPoll(
        "Test Poll",
        "Test Description",
        startTime,
        endTime,
        ["Option 1", "Option 2", "Option 3"]
      );
      pollId = 1;
    });

    it("Should allow owner to end poll after end time", async function () {
      // Wait for poll to end
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(owner).endPoll(pollId))
        .to.emit(votingContract, "PollEnded")
        .withArgs(pollId, 0); // Default winning option is 0

      const pollInfo = await votingContract.getPollInfo(pollId);
      expect(pollInfo.isActive).to.be.false;
    });

    it("Should not allow non-owner to end poll", async function () {
      // Wait for poll to end
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      await expect(votingContract.connect(voter1).endPoll(pollId))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow ending poll before end time", async function () {
      await expect(votingContract.connect(owner).endPoll(pollId))
        .to.be.revertedWith("Poll has not ended yet");
    });

    it("Should not allow ending already ended poll", async function () {
      // Wait for poll to end
      await ethers.provider.send("evm_increaseTime", [3601]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(owner).endPoll(pollId);

      await expect(votingContract.connect(owner).endPoll(pollId))
        .to.be.revertedWith("Poll is already ended");
    });

    it("Should determine correct winning option", async function () {
      // Wait for poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      // Vote: Option 1 gets 2 votes, Option 2 gets 1 vote
      await votingContract.connect(voter1).vote(pollId, 0);
      await votingContract.connect(voter2).vote(pollId, 1);
      await votingContract.connect(voter3).vote(pollId, 0);

      // Wait for poll to end
      await ethers.provider.send("evm_increaseTime", [3599]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(owner).endPoll(pollId);

      const winningOption = await votingContract.getWinningOption(pollId);
      expect(winningOption).to.equal(0); // Option 1 should win
    });
  });

  describe("Query Functions", function () {
    let pollId;
    let startTime;
    let endTime;

    beforeEach(async function () {
      startTime = Math.floor(Date.now() / 1000) + 120;
      endTime = startTime + 3600;
      
      await votingContract.connect(owner).createPoll(
        "Test Poll",
        "Test Description",
        startTime,
        endTime,
        ["Option 1", "Option 2", "Option 3"]
      );
      pollId = 1;
    });

    it("Should return correct poll info", async function () {
      const pollInfo = await votingContract.getPollInfo(pollId);
      
      expect(pollInfo.id).to.equal(pollId);
      expect(pollInfo.title).to.equal("Test Poll");
      expect(pollInfo.description).to.equal("Test Description");
      expect(pollInfo.startTime).to.equal(startTime);
      expect(pollInfo.endTime).to.equal(endTime);
      expect(pollInfo.isActive).to.be.true;
      expect(pollInfo.totalVotes).to.equal(0);
      expect(pollInfo.options).to.deep.equal(["Option 1", "Option 2", "Option 3"]);
      expect(pollInfo.voteCounts).to.deep.equal([0, 0, 0]);
    });

    it("Should return correct voting status", async function () {
      expect(await votingContract.hasVoted(pollId, voter1.address)).to.be.false;

      // Wait for poll to start and vote
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      await votingContract.connect(voter1).vote(pollId, 0);

      expect(await votingContract.hasVoted(pollId, voter1.address)).to.be.true;
      expect(await votingContract.hasVoted(pollId, voter2.address)).to.be.false;
    });

    it("Should return active polls", async function () {
      // Create another poll
      await votingContract.connect(owner).createPoll(
        "Test Poll 2",
        "Test Description 2",
        startTime + 7200, // Start later
        endTime + 7200,
        ["Option A", "Option B"]
      );

      let activePolls = await votingContract.getActivePolls();
      expect(activePolls.length).to.equal(0); // No active polls yet

      // Wait for first poll to start
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      activePolls = await votingContract.getActivePolls();
      expect(activePolls.length).to.equal(1);
      expect(activePolls[0]).to.equal(1);

      // Wait for first poll to end
      await ethers.provider.send("evm_increaseTime", [3599]);
      await ethers.provider.send("evm_mine");

      activePolls = await votingContract.getActivePolls();
      expect(activePolls.length).to.equal(0); // No active polls
    });

    it("Should not allow getting winning option for active poll", async function () {
      await expect(votingContract.getWinningOption(pollId))
        .to.be.revertedWith("Poll is still active");
    });
  });
});
