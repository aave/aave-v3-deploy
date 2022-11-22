import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { makeSuite, TestEnv } from "../utils/make-suite";
import { parseUnitsFromToken, waitForTx } from "../../helpers/utilities/tx";
import { MAX_UINT_AMOUNT } from "../../helpers/constants";
import { ethers, network } from "hardhat";

const { expect } = require("chai");

makeSuite("Mainnet Check list", (testEnv: TestEnv) => {
  const zero = BigNumber.from("0");
  const depositSize = parseEther("5");

  it("Check WETH price", async () => {
    const { weth, oracle } = testEnv;

    const price = await oracle.getAssetPrice(weth.address);

    expect(price).gt("0", "WETH PRICE CAN NOT BE ZERO");
  });

  it("Deposit WETH", async () => {
    const { users, wrappedTokenGateway, aWETH, pool } = testEnv;

    const user = users[1];

    // Deposit with native ETH
    await wrappedTokenGateway
      .connect(user.signer)
      .depositETH(pool.address, user.address, "0", { value: depositSize });

    const aTokensBalance = await aWETH.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);
  });

  it("Withdraw WETH - Partial", async () => {
    const { users, wrappedTokenGateway, aWETH, pool } = testEnv;

    const user = users[1];
    const priorEthersBalance = await user.signer.getBalance();
    const aTokensBalance = await aWETH.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero, "User should have aTokens.");

    // Partially withdraw native ETH
    const partialWithdraw = await parseUnitsFromToken(aWETH.address, "2");

    // Approve the aTokens to Gateway so Gateway can withdraw and convert to Ether
    const approveTx = await aWETH
      .connect(user.signer)
      .approve(wrappedTokenGateway.address, MAX_UINT_AMOUNT);
    const { gasUsed: approveGas, effectiveGasPrice: approveGasPrice } =
      await waitForTx(approveTx);

    const withdrawTx = await wrappedTokenGateway
      .connect(user.signer)
      .withdrawETH(pool.address, partialWithdraw, user.address);

    // Partial Withdraw and send native Ether to user
    const { gasUsed: withdrawGas, effectiveGasPrice: withdrawGasPrice } =
      await waitForTx(withdrawTx);

    const afterPartialEtherBalance = await user.signer.getBalance();
    const afterPartialATokensBalance = await aWETH.balanceOf(user.address);
    const gasCosts = approveGas
      .mul(approveGasPrice)
      .add(withdrawGas.mul(withdrawGasPrice));

    expect(afterPartialEtherBalance).to.be.equal(
      priorEthersBalance.add(partialWithdraw).sub(gasCosts),
      "User ETHER balance should contain the partial withdraw"
    );
    expect(afterPartialATokensBalance).to.be.equal(
      aTokensBalance.sub(partialWithdraw),
      "User aWETH balance should be subtracted"
    );
  });

  it("Withdraw WETH - Full", async () => {
    const { users, aWETH, wrappedTokenGateway, pool } = testEnv;

    const user = users[1];
    const priorEthersBalance = await user.signer.getBalance();
    const aTokensBalance = await aWETH.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero, "User should have aTokens.");

    // Approve the aTokens to Gateway so Gateway can withdraw and convert to Ether
    const approveTx = await aWETH
      .connect(user.signer)
      .approve(wrappedTokenGateway.address, MAX_UINT_AMOUNT);
    const { gasUsed: approveGas, effectiveGasPrice: approveGasPrice } =
      await waitForTx(approveTx);

    // Full withdraw
    const { gasUsed: withdrawGas, effectiveGasPrice: withdrawGasPrice } =
      await waitForTx(
        await wrappedTokenGateway
          .connect(user.signer)
          .withdrawETH(pool.address, MAX_UINT_AMOUNT, user.address)
      );

    const afterFullEtherBalance = await user.signer.getBalance();
    const afterFullATokensBalance = await aWETH.balanceOf(user.address);
    const gasCosts = approveGas
      .mul(approveGasPrice)
      .add(withdrawGas.mul(withdrawGasPrice));

    expect(afterFullEtherBalance).to.be.eq(
      priorEthersBalance.add(aTokensBalance).sub(gasCosts),
      "User ETHER balance should contain the full withdraw"
    );
    expect(afterFullATokensBalance).to.be.eq(
      0,
      "User aWETH balance should be zero"
    );
  });

  it("Borrow variable WETH and Full Repay with ETH", async () => {
    const { users, wrappedTokenGateway, aWETH, weth, pool, helpersContract } =
      testEnv;

    const borrowSize = parseEther("1");
    const repaySize = borrowSize.add(borrowSize.mul(5).div(100));
    const user = users[1];

    const { variableDebtTokenAddress } =
      await helpersContract.getReserveTokensAddresses(weth.address);

    const varDebtToken = await ethers.getContractAt(
      "VariableDebtToken",
      variableDebtTokenAddress
    );

    // Deposit with native ETH
    await waitForTx(
      await wrappedTokenGateway
        .connect(user.signer)
        .depositETH(pool.address, user.address, "0", { value: depositSize })
    );

    const aTokensBalance = await aWETH.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);

    // Borrow WETH with WETH as collateral
    await waitForTx(
      await pool
        .connect(user.signer)
        .borrow(weth.address, borrowSize, "2", "0", user.address)
    );

    const debtBalance = await varDebtToken.balanceOf(user.address);

    expect(debtBalance).to.be.gt(zero);

    // Partial Repay WETH loan with native ETH
    const partialPayment = repaySize.div(2);
    await waitForTx(
      await wrappedTokenGateway
        .connect(user.signer)
        .repayETH(pool.address, partialPayment, "2", user.address, {
          value: partialPayment,
        })
    );

    const debtBalanceAfterPartialRepay = await varDebtToken.balanceOf(
      user.address
    );
    expect(debtBalanceAfterPartialRepay).to.be.lt(debtBalance);

    // Full Repay WETH loan with native ETH
    await waitForTx(
      await wrappedTokenGateway
        .connect(user.signer)
        .repayETH(pool.address, MAX_UINT_AMOUNT, "2", user.address, {
          value: repaySize,
        })
    );
    const debtBalanceAfterFullRepay = await varDebtToken.balanceOf(
      user.address
    );
    expect(debtBalanceAfterFullRepay).to.be.eq(zero);
  });

  it("Borrow ETH via delegateApprove ETH and repays back", async () => {
    const { users, wrappedTokenGateway, aWETH, weth, helpersContract, pool } =
      testEnv;
    const borrowSize = parseEther("1");
    const user = users[2];
    const { variableDebtTokenAddress } =
      await helpersContract.getReserveTokensAddresses(weth.address);
    const varDebtToken = await ethers.getContractAt(
      "VariableDebtToken",
      variableDebtTokenAddress
    );

    const priorDebtBalance = await varDebtToken.balanceOf(user.address);
    expect(priorDebtBalance).to.be.eq(zero);

    // Deposit WETH with native ETH
    await wrappedTokenGateway
      .connect(user.signer)
      .depositETH(pool.address, user.address, "0", { value: depositSize });

    const aTokensBalance = await aWETH.balanceOf(user.address);

    expect(aTokensBalance).to.be.gt(zero);
    expect(aTokensBalance).to.be.gte(depositSize);

    // Delegates borrowing power of WETH to WrappedTokenGateway
    await waitForTx(
      await varDebtToken
        .connect(user.signer)
        .approveDelegation(wrappedTokenGateway.address, borrowSize)
    );

    // Borrows ETH with WETH as collateral
    await waitForTx(
      await wrappedTokenGateway
        .connect(user.signer)
        .borrowETH(pool.address, borrowSize, "2", "0")
    );

    const debtBalance = await varDebtToken.balanceOf(user.address);

    expect(debtBalance).to.be.gt(zero);

    // Full Repay WETH loan with native ETH
    await waitForTx(
      await wrappedTokenGateway
        .connect(user.signer)
        .repayETH(pool.address, MAX_UINT_AMOUNT, "2", user.address, {
          value: borrowSize.mul(2),
        })
    );
    const debtBalanceAfterFullRepay = await varDebtToken.balanceOf(
      user.address
    );
    expect(debtBalanceAfterFullRepay).to.be.eq(zero);
  });

  it("Should revert if receiver function receives Ether if not WETH", async () => {
    const { users, wrappedTokenGateway } = testEnv;
    const user = users[0];
    const amount = parseEther("1");

    // Call receiver function (empty data + value)
    await expect(
      user.signer.sendTransaction({
        to: wrappedTokenGateway.address,
        value: amount,
        gasLimit: network.config.gas,
      })
    ).to.be.revertedWith("Receive not allowed");
  });

  it("Should revert if fallback functions is called with Ether", async () => {
    const { users, wrappedTokenGateway } = testEnv;
    const user = users[0];
    const amount = parseEther("1");
    const fakeABI = ["function wantToCallFallback()"];
    const abiCoder = new ethers.utils.Interface(fakeABI);
    const fakeMethodEncoded = abiCoder.encodeFunctionData(
      "wantToCallFallback",
      []
    );

    // Call fallback function with value
    await expect(
      user.signer.sendTransaction({
        to: wrappedTokenGateway.address,
        data: fakeMethodEncoded,
        value: amount,
        gasLimit: network.config.gas,
      })
    ).to.be.revertedWith("Fallback not allowed");
  });

  it("Should revert if fallback functions is called", async () => {
    const { users, wrappedTokenGateway } = testEnv;
    const user = users[0];

    const fakeABI = ["function wantToCallFallback()"];
    const abiCoder = new ethers.utils.Interface(fakeABI);
    const fakeMethodEncoded = abiCoder.encodeFunctionData(
      "wantToCallFallback",
      []
    );

    // Call fallback function without value
    await expect(
      user.signer.sendTransaction({
        to: wrappedTokenGateway.address,
        data: fakeMethodEncoded,
        gasLimit: network.config.gas,
      })
    ).to.be.revertedWith("Fallback not allowed");
  });
});
