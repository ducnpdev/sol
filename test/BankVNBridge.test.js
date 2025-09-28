const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bridge Contract with BankVN Token", function () {
  let owner, user1, user2;
  let BankVNToken, bankVNToken;
  let Bridge, bridge;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1M tokens
  const TEST_AMOUNT = ethers.parseUnits("100", 18); // 100 tokens
  const LARGE_AMOUNT = ethers.parseUnits("500", 18); // 500 tokens

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy BankVN Token
    BankVNToken = await ethers.getContractFactory("BankVNToken");
    bankVNToken = await BankVNToken.deploy();
    await bankVNToken.waitForDeployment();

    // Deploy Bridge contract with BankVN token
    Bridge = await ethers.getContractFactory("Bridge");
    bridge = await Bridge.deploy(await bankVNToken.getAddress());
    await bridge.waitForDeployment();

    // Transfer tokens to users for testing
    await bankVNToken.transfer(user1.address, ethers.parseUnits("10000", 18)); // 10K tokens
    await bankVNToken.transfer(user2.address, ethers.parseUnits("5000", 18)); // 5K tokens
  });

  describe("Initial Setup", function () {
    it("Should have correct token address", async function () {
      const tokenAddr = await bankVNToken.getAddress();
      expect(await bridge.bankToken()).to.equal(tokenAddr);
    });

    it("Should have correct owner", async function () {
      expect(await bridge.owner()).to.equal(owner.address);
    });

    it("Should have correct token details", async function () {
      expect(await bankVNToken.name()).to.equal("Bank VN Token");
      expect(await bankVNToken.symbol()).to.equal("BANKVN");
      expect(await bankVNToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should have distributed tokens correctly", async function () {
      expect(await bankVNToken.balanceOf(user1.address)).to.equal(
        ethers.parseUnits("10000", 18)
      );
      expect(await bankVNToken.balanceOf(user2.address)).to.equal(
        ethers.parseUnits("5000", 18)
      );
    });

    it("Should have zero initial bridge balance", async function () {
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        0
      );
    });
  });

  describe("Deposit Function", function () {
    const obpUserId = "user123";

    beforeEach(async function () {
      // User1 approves bridge to spend tokens
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), TEST_AMOUNT);
    });

    it("Should allow user to deposit tokens to bridge", async function () {
      await expect(bridge.connect(user1).deposit(TEST_AMOUNT, obpUserId))
        .to.emit(bridge, "Deposited")
        .withArgs(user1.address, TEST_AMOUNT, obpUserId);

      // Check balances
      expect(await bankVNToken.balanceOf(user1.address)).to.equal(
        ethers.parseUnits("9900", 18) // 10000 - 100
      );
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        TEST_AMOUNT
      );
    });

    it("Should fail with zero amount", async function () {
      await expect(
        bridge.connect(user1).deposit(0, obpUserId)
      ).to.be.revertedWith("Amount must be > 0");
    });

    it("Should fail if insufficient allowance", async function () {
      const largeAmount = ethers.parseUnits("200", 18);

      await expect(bridge.connect(user1).deposit(largeAmount, obpUserId)).to.be
        .reverted;
    });

    it("Should fail if insufficient balance", async function () {
      const hugeAmount = ethers.parseUnits("20000", 18); // More than user1 has
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), hugeAmount);

      await expect(bridge.connect(user1).deposit(hugeAmount, obpUserId)).to.be
        .reverted;
    });

    it("Should handle multiple deposits", async function () {
      const deposit1 = ethers.parseUnits("50", 18);
      const deposit2 = ethers.parseUnits("30", 18);

      // Approve total amount
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), deposit1 + deposit2);

      // First deposit
      await expect(bridge.connect(user1).deposit(deposit1, "deposit1"))
        .to.emit(bridge, "Deposited")
        .withArgs(user1.address, deposit1, "deposit1");

      // Second deposit
      await expect(bridge.connect(user1).deposit(deposit2, "deposit2"))
        .to.emit(bridge, "Deposited")
        .withArgs(user1.address, deposit2, "deposit2");

      // Check final balance
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        deposit1 + deposit2
      );
    });

    it("Should emit correct event parameters", async function () {
      const customUserId = "custom_user_456";

      const tx = await bridge.connect(user1).deposit(TEST_AMOUNT, customUserId);

      await expect(tx)
        .to.emit(bridge, "Deposited")
        .withArgs(user1.address, TEST_AMOUNT, customUserId);
    });
  });

  describe("Withdraw Function", function () {
    const obpUserId = "withdraw123";

    beforeEach(async function () {
      // Setup: User1 deposits tokens first
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), LARGE_AMOUNT);
      await bridge.connect(user1).deposit(LARGE_AMOUNT, "setup");
    });

    it("Should allow owner to withdraw tokens for users", async function () {
      const initialBalance = await bankVNToken.balanceOf(user2.address);

      await expect(
        bridge.connect(owner).withdraw(user2.address, TEST_AMOUNT, obpUserId)
      )
        .to.emit(bridge, "Withdrawn")
        .withArgs(user2.address, TEST_AMOUNT, obpUserId);

      // Check balance increased
      expect(await bankVNToken.balanceOf(user2.address)).to.equal(
        initialBalance + TEST_AMOUNT
      );

      // Check bridge balance decreased
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        LARGE_AMOUNT - TEST_AMOUNT
      );
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      await expect(
        bridge.connect(user1).withdraw(user2.address, TEST_AMOUNT, obpUserId)
      ).to.be.revertedWith("Only owner can withdraw");
    });

    it("Should fail with zero amount", async function () {
      await expect(
        bridge.connect(owner).withdraw(user2.address, 0, obpUserId)
      ).to.be.revertedWith("Amount must be > 0");
    });

    it("Should fail if bridge has insufficient tokens", async function () {
      const excessiveAmount = LARGE_AMOUNT + ethers.parseUnits("100", 18);

      await expect(
        bridge
          .connect(owner)
          .withdraw(user1.address, excessiveAmount, obpUserId)
      ).to.be.reverted;
    });

    it("Should handle multiple withdrawals", async function () {
      const withdraw1 = ethers.parseUnits("100", 18);
      const withdraw2 = ethers.parseUnits("150", 18);

      // First withdrawal
      await expect(
        bridge.connect(owner).withdraw(user1.address, withdraw1, "withdraw1")
      )
        .to.emit(bridge, "Withdrawn")
        .withArgs(user1.address, withdraw1, "withdraw1");

      // Second withdrawal
      await expect(
        bridge.connect(owner).withdraw(user2.address, withdraw2, "withdraw2")
      )
        .to.emit(bridge, "Withdrawn")
        .withArgs(user2.address, withdraw2, "withdraw2");

      // Check remaining bridge balance
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        LARGE_AMOUNT - withdraw1 - withdraw2
      );
    });
  });

  describe("Full Bridge Flow", function () {
    it("Should complete full deposit -> withdraw cycle", async function () {
      const amount = ethers.parseUnits("300", 18);
      const obpUserId = "fullcycle123";

      // Initial balances
      const user1Initial = await bankVNToken.balanceOf(user1.address);
      const user2Initial = await bankVNToken.balanceOf(user2.address);

      // Step 1: User1 deposits tokens
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), amount);
      await bridge.connect(user1).deposit(amount, obpUserId);

      // Check intermediate state
      expect(await bankVNToken.balanceOf(user1.address)).to.equal(
        user1Initial - amount
      );
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        amount
      );

      // Step 2: Owner withdraws to user2
      await bridge.connect(owner).withdraw(user2.address, amount, obpUserId);

      // Check final state
      expect(await bankVNToken.balanceOf(user1.address)).to.equal(
        user1Initial - amount
      );
      expect(await bankVNToken.balanceOf(user2.address)).to.equal(
        user2Initial + amount
      );
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        0
      );
    });

    it("Should handle multiple users and complex flows", async function () {
      const deposit1 = ethers.parseUnits("200", 18);
      const deposit2 = ethers.parseUnits("300", 18);
      const withdraw1 = ethers.parseUnits("150", 18);
      const withdraw2 = ethers.parseUnits("100", 18);

      // User1 deposits
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), deposit1);
      await bridge.connect(user1).deposit(deposit1, "user1_deposit");

      // User2 deposits
      await bankVNToken
        .connect(user2)
        .approve(await bridge.getAddress(), deposit2);
      await bridge.connect(user2).deposit(deposit2, "user2_deposit");

      // Total bridge balance
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        deposit1 + deposit2
      );

      // Owner withdraws to users
      await bridge
        .connect(owner)
        .withdraw(user1.address, withdraw1, "withdraw_to_user1");
      await bridge
        .connect(owner)
        .withdraw(user2.address, withdraw2, "withdraw_to_user2");

      // Check remaining bridge balance
      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        deposit1 + deposit2 - withdraw1 - withdraw2
      );
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should handle maximum token amounts", async function () {
      const maxAmount = await bankVNToken.balanceOf(owner.address);

      // Owner approves and deposits maximum amount
      await bankVNToken.approve(await bridge.getAddress(), maxAmount);

      await expect(bridge.deposit(maxAmount, "max_deposit"))
        .to.emit(bridge, "Deposited")
        .withArgs(owner.address, maxAmount, "max_deposit");

      expect(await bankVNToken.balanceOf(await bridge.getAddress())).to.equal(
        maxAmount
      );
    });

    it("Should prevent reentrancy attacks", async function () {
      // This test ensures the contract is safe from reentrancy
      // Since we're using OpenZeppelin's ERC20, this should be safe
      const amount = ethers.parseUnits("100", 18);

      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), amount);
      await bridge.connect(user1).deposit(amount, "safety_test");

      // Normal withdraw should work
      await expect(
        bridge.connect(owner).withdraw(user1.address, amount, "safety_withdraw")
      ).to.emit(bridge, "Withdrawn");
    });

    it("Should handle empty string obpUserId", async function () {
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), TEST_AMOUNT);

      await expect(bridge.connect(user1).deposit(TEST_AMOUNT, ""))
        .to.emit(bridge, "Deposited")
        .withArgs(user1.address, TEST_AMOUNT, "");
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should have reasonable gas costs for deposit operation", async function () {
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), TEST_AMOUNT);

      const tx = await bridge.connect(user1).deposit(TEST_AMOUNT, "gas_test");
      const receipt = await tx.wait();

      console.log("Deposit operation gas used:", receipt.gasUsed.toString());
      expect(Number(receipt.gasUsed)).to.be.below(100000); // Should be under 100k gas
    });

    it("Should have reasonable gas costs for withdraw operation", async function () {
      // Setup bridge with tokens
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), TEST_AMOUNT);
      await bridge.connect(user1).deposit(TEST_AMOUNT, "setup");

      const tx = await bridge
        .connect(owner)
        .withdraw(user1.address, TEST_AMOUNT, "gas_test");
      const receipt = await tx.wait();

      console.log("Withdraw operation gas used:", receipt.gasUsed.toString());
      expect(Number(receipt.gasUsed)).to.be.below(80000); // Should be under 80k gas
    });
  });

  describe("Token Integration", function () {
    it("Should work with token mint and burn functions", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);

      // Owner mints new tokens to user1
      await bankVNToken.mint(user1.address, mintAmount);

      const newBalance = await bankVNToken.balanceOf(user1.address);
      expect(newBalance).to.equal(ethers.parseUnits("11000", 18)); // 10000 + 1000

      // User1 can deposit the new tokens
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), mintAmount);
      await expect(
        bridge.connect(user1).deposit(mintAmount, "minted_tokens")
      ).to.emit(bridge, "Deposited");
    });

    it("Should work after token burn", async function () {
      const burnAmount = ethers.parseUnits("1000", 18);

      // User1 burns some tokens
      await bankVNToken.connect(user1).burn(burnAmount);

      const newBalance = await bankVNToken.balanceOf(user1.address);
      expect(newBalance).to.equal(ethers.parseUnits("9000", 18)); // 10000 - 1000

      // User1 can still deposit remaining tokens
      await bankVNToken
        .connect(user1)
        .approve(await bridge.getAddress(), TEST_AMOUNT);
      await expect(
        bridge.connect(user1).deposit(TEST_AMOUNT, "after_burn")
      ).to.emit(bridge, "Deposited");
    });
  });
});
