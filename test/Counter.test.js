const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  describe("Deployment", function () {
    it("Should set the initial count to 0", async function () {
      expect(await counter.getCount()).to.equal(0);
    });
  });

  describe("Increment", function () {
    it("Should increment the count", async function () {
      await counter.increment();
      expect(await counter.getCount()).to.equal(1);
    });

    it("Should emit CountIncremented event", async function () {
      await expect(counter.increment())
        .to.emit(counter, "CountIncremented")
        .withArgs(1);
    });
  });

  describe("Decrement", function () {
    it("Should decrement the count", async function () {
      await counter.increment();
      await counter.increment();
      await counter.decrement();
      expect(await counter.getCount()).to.equal(1);
    });

    it("Should revert when trying to decrement below zero", async function () {
      await expect(counter.decrement()).to.be.revertedWith(
        "Counter: cannot decrement below zero"
      );
    });

    it("Should emit CountDecremented event", async function () {
      await counter.increment();
      await expect(counter.decrement())
        .to.emit(counter, "CountDecremented")
        .withArgs(0);
    });
  });

  describe("Reset", function () {
    it("Should reset the count to 0", async function () {
      await counter.increment();
      await counter.increment();
      await counter.reset();
      expect(await counter.getCount()).to.equal(0);
    });
  });
});
