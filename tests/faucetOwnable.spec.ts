import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { makeSuite, TestEnv } from "./utils/make-suite";

makeSuite("FaucetOwnable", (testEnv: TestEnv) => {
  it("FaucetOwnable should ask MintableERC20 to mint and transfer to user", async () => {
    const { deployer, users, dai, faucetOwnable } = testEnv;
    const mintAmount = parseEther("100");
    const tx = await faucetOwnable
      .connect(deployer.signer)
      .mint(dai.address, users[1].address, mintAmount);

    await expect(await dai.balanceOf(users[1].address)).eq(mintAmount);
  });

  it("FaucetOwnable should not be able to mint tokens unless owner", async () => {
    const { deployer, users, dai, faucetOwnable } = testEnv;
    const mintAmount = parseEther("100");

    await expect(
      faucetOwnable
        .connect(users[0].signer)
        .mint(dai.address, users[0].address, mintAmount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
