import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { waitForTx } from "../helpers";
import { makeSuite, TestEnv } from "./utils/make-suite";

makeSuite("FaucetOwnable", (testEnv: TestEnv) => {
  const mintAmount = parseEther("100");

  describe("Permissioned mode: disabled", () => {
    before(async () => {
      // Enforce permissioned mode as disabled for deterministic test suite
      const { faucetOwnable } = testEnv;

      await waitForTx(await faucetOwnable.setPermissioned(false));
    });
    it("Mint can be called by anyone", async () => {
      const {
        users: [user],
        dai,
        faucetOwnable,
      } = testEnv;

      await waitForTx(
        await faucetOwnable
          .connect(user.signer)
          .mint(dai.address, user.address, mintAmount)
      );

      await expect(await dai.balanceOf(user.address)).eq(mintAmount);
    });

    it("Getter isPermissioned should return false", async () => {
      const { faucetOwnable } = testEnv;

      await expect(await faucetOwnable.isPermissioned()).is.equal(false);
    });
  });

  describe("Permissioned mode: enabled", () => {
    before(async () => {
      // Enforce permissioned mode as enabled for deterministic test suite
      const { faucetOwnable } = testEnv;

      await waitForTx(await faucetOwnable.setPermissioned(true));
    });
    it("Mint function should revert if caller not owner", async () => {
      const {
        users: [, , user],
        dai,
        faucetOwnable,
      } = testEnv;

      await expect(
        faucetOwnable
          .connect(user.signer)
          .mint(dai.address, user.address, mintAmount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Mint function can only be called by owner", async () => {
      const {
        users: [, , , user],
        dai,
        faucetOwnable,
        deployer,
      } = testEnv;

      await waitForTx(
        await faucetOwnable
          .connect(deployer.signer)
          .mint(dai.address, user.address, mintAmount)
      );

      await expect(await dai.balanceOf(user.address)).eq(mintAmount);
    });

    it("Getter isPermissioned should return true", async () => {
      const { faucetOwnable } = testEnv;

      await expect(await faucetOwnable.isPermissioned()).is.equal(true);
    });
  });

  it("Function setPermissioned should revert if caller not owner", async () => {
    const {
      users: [, , user],
      faucetOwnable,
    } = testEnv;

    await expect(
      faucetOwnable.connect(user.signer).setPermissioned(false)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Function setPermissioned can only be called by owner: false input", async () => {
    const { deployer, faucetOwnable } = testEnv;

    await waitForTx(
      await faucetOwnable.connect(deployer.signer).setPermissioned(false)
    );

    expect(await faucetOwnable.isPermissioned()).equal(false);
  });

  it("Function setPermissioned can only be called by owner: true input", async () => {
    const { deployer, faucetOwnable } = testEnv;

    await waitForTx(
      await faucetOwnable.connect(deployer.signer).setPermissioned(true)
    );

    expect(await faucetOwnable.isPermissioned()).equal(true);
  });
});
