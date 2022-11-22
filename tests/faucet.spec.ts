import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { makeSuite, TestEnv } from "./utils/make-suite";

makeSuite("Faucet", (testEnv: TestEnv) => {
  it("Faucet should ask MintableERC20 to mint and transfer to user", async () => {
    const { users, dai, faucet } = testEnv;
    const mintAmount = parseEther("100");
    const tx = await faucet
      .connect(users[0].signer)
      .mint(dai.address, mintAmount);

    await expect(await dai.balanceOf(users[0].address)).eq(mintAmount);
  });
});
