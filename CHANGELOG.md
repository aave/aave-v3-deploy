# Changelog

## [1.30.1](https://github.com/aave/aave-v3-deploy-tasks/compare/v1.30.0...v1.30.1) (2022-11-18)


### Bug Fixes

* Fix rewards distributor contract deploy ([eece503](https://github.com/aave/aave-v3-deploy-tasks/commit/eece50325dd4e488a243bd8a17bf8c2aa4463de5))

## [1.30.0](https://github.com/aave/aave-v3-deploy-tasks/compare/v1.29.0...v1.30.0) (2022-11-17)


### Features

* support forks with default hardhat mnemonic if process.env.MNEMONIC is not provided ([76759ad](https://github.com/aave/aave-v3-deploy-tasks/commit/76759ad6d562844b2dcbe563c31cd2b4202d0ad6))

## [1.29.0](https://github.com/aave/aave-v3-deploy-tasks/compare/v1.28.0...v1.29.0) (2022-11-17)


### Miscellaneous Chores

* release 1.29.0 ([6a45f17](https://github.com/aave/aave-v3-deploy-tasks/commit/6a45f17a650f3e03ef1daec786b83ba24120aa2a))

## [1.28.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.27.0...v1.28.0) (2022-08-03)


### Features

* update periphery deps ([0184229](https://www.github.com/aave/aave-v3-deploy/commit/0184229e278fcb37b5b59d0eff781453d24f119d))

## [1.27.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.26.0...v1.27.0) (2022-07-27)


### Features

* add reserve rate strategies and stable borrow checks ([a36832f](https://www.github.com/aave/aave-v3-deploy/commit/a36832f5f8a374149d41f08441016943db1d808d))

## [1.26.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.25.0...v1.26.0) (2022-07-26)


### Features

* rollback previous test market config ([2158a63](https://www.github.com/aave/aave-v3-deploy/commit/2158a63a1969f262ec48c78c18d3b1943ec91436))

## [1.25.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.24.0...v1.25.0) (2022-07-26)


### Features

* add atoken upgrade task and atoken config review task ([cd6f3da](https://www.github.com/aave/aave-v3-deploy/commit/cd6f3dac3db5ec1e5ba518a9232c70da931e45ec))
* Add dockerization ([1ea9175](https://www.github.com/aave/aave-v3-deploy/commit/1ea91754ce0835cf2cb1f55e8760050dee5bf154))
* add emission manager owner to view task ([0586f93](https://www.github.com/aave/aave-v3-deploy/commit/0586f93b57ed5da705522d7c3c4bf5116437ef8b))
* add emission manager to deploy scripts, added transfer emission manager script ([079b1e5](https://www.github.com/aave/aave-v3-deploy/commit/079b1e509508d2e948aeaeef977b6199064bc62d))
* add EmissionManager deploy function helper ([19a8d2d](https://www.github.com/aave/aave-v3-deploy/commit/19a8d2d55eb2bec159913a16da3188f57bf66101))
* add fallback oracle task ([220f46d](https://www.github.com/aave/aave-v3-deploy/commit/220f46d63757c5737dbb911b7227c1e150ad5681))
* add goerli optimism support, transfer balance to proxy admin at init of deployment ([1773e40](https://www.github.com/aave/aave-v3-deploy/commit/1773e40b08a3ae75c04091118c4e111efb567cd6))
* add optional emission admin and strategy deployment at Transfer Emission Manager task ([843ae39](https://www.github.com/aave/aave-v3-deploy/commit/843ae3960ff6597725ab081af498c9e34ca08960))
* add ParaswapRegistry to Fantom network ([06f5136](https://www.github.com/aave/aave-v3-deploy/commit/06f513653e8c6dbeb1635e176c6e4ec1297a1ca1))
* add Polygon case to use crosschain bridge executor across acl tasks ([093e1f9](https://www.github.com/aave/aave-v3-deploy/commit/093e1f9451bfe9f179cf9f3ae597c4ac23d89851))
* add PullRewardsStrategy deployment. ([f89b6be](https://www.github.com/aave/aave-v3-deploy/commit/f89b6be3b649f7eaa2a4426c49b59c37334eab1c))
* add renounce pool admin task, update roles viewer ([d787158](https://www.github.com/aave/aave-v3-deploy/commit/d787158f7a3906f33608524d165c867a6db398f0))
* add review-e-mode task with support for stablecoin e-mode. Change the LQB to 1% for all EModes. ([9d1eed6](https://www.github.com/aave/aave-v3-deploy/commit/9d1eed63f2c659c0adecf278c32fcd86bb84b827))
* Add review-rates-strategies task. Move utility fn to utilities. ([470e089](https://www.github.com/aave/aave-v3-deploy/commit/470e089744ba751cb4656bd7031158a1ef5c99f7))
* add rewards controller updater task ([f8473c9](https://www.github.com/aave/aave-v3-deploy/commit/f8473c9994406d799731d67a7033d7628df2b463))
* add support for arbitrum nitro goerli testnet ([3efb5e4](https://www.github.com/aave/aave-v3-deploy/commit/3efb5e47c9ec944992b02e203dc9500cc954ac92))
* add symbol name to PullRewardsTransferStrategy artifact ([74852ca](https://www.github.com/aave/aave-v3-deploy/commit/74852caaf365c4cc58f0cda28a149cbd1f08a855))
* Add task to review and fix suply caps ([ed2def2](https://www.github.com/aave/aave-v3-deploy/commit/ed2def2e27a60b10a76cd3acc272a56609d42a9a))
* Add task to review if reserves borrow stable is enabled matching configuration ([6c07bc6](https://www.github.com/aave/aave-v3-deploy/commit/6c07bc6a70126f2ad211dbedc70943f149f5ac18))
* add task to transfer the protocol ownership ([0c7c717](https://www.github.com/aave/aave-v3-deploy/commit/0c7c717c58c41233042b92b719711faa4279b835))
* add verify atokens and debt tokens script with hardhat-etherscan ([8887cfa](https://www.github.com/aave/aave-v3-deploy/commit/8887cfaab00ebeb7fc6a5364e37945ad6d4ad4f4))
* added artifacts parser, added asserts at table ([eb35feb](https://www.github.com/aave/aave-v3-deploy/commit/eb35feba03a3acdeeafb9072920380e60c0e7a29))
* added function to retrieve current transparent proxy admin by slot ([93c6e2b](https://www.github.com/aave/aave-v3-deploy/commit/93c6e2b00bae4ecbf296fdb02203d6d776902630))
* added more cases to handle cases where is already transfered the ownership or if the accounts loaded doesnt match expected current owner ([a60439c](https://www.github.com/aave/aave-v3-deploy/commit/a60439cb1604ba341154346e1478231de7299198))
* centralize MULTISIG_ADDRESS constant at helpers/constants.ts ([6595698](https://www.github.com/aave/aave-v3-deploy/commit/65956981620d79d2854e6b2e497c3e7299917eab))
* extend transfer-emission-manager to add reward admin and transfer to multisig ([c709c1f](https://www.github.com/aave/aave-v3-deploy/commit/c709c1f455b55d55593aa43cee5385a880f7f0a9))
* fix network ids ([b024838](https://www.github.com/aave/aave-v3-deploy/commit/b024838b67028dbea3ff17cc0dbfdee2c706e5cf))
* merge and fix conflicts, support tenderly network ([7cefc25](https://www.github.com/aave/aave-v3-deploy/commit/7cefc25d434d9947f12eac62acca968582e412d1))
* merge package-lock and types, add pool pause task ([2c96bbc](https://www.github.com/aave/aave-v3-deploy/commit/2c96bbca37ef72094ee57a6d88a99b4ae50f4c59))
* move ACL Admin and PoolAddressesProviderRegistry change of ownership to transfer-acl-roles script ([668ba96](https://www.github.com/aave/aave-v3-deploy/commit/668ba96128425f8151bad9ea996f59a3a2e99566))
* remove supply caps for volatile assets ([7ac9111](https://www.github.com/aave/aave-v3-deploy/commit/7ac9111baa517392281565c57d365cdf578e805a))
* Remove the asset listing admin at task and deployment scripts ([f0dce82](https://www.github.com/aave/aave-v3-deploy/commit/f0dce82cf977b52a9ae113333c0fb7642c6c1882))
* remove the change of emission manager at set-rewards-at-provider.ts task ([dd95865](https://www.github.com/aave/aave-v3-deploy/commit/dd958653799d753fd5fc478a8a8c52fbf99d6bb6))
* rename view roles, comment acl admin transfer ([661926e](https://www.github.com/aave/aave-v3-deploy/commit/661926efc68f6c5d67fc8f8c308675eddd7b4cb0))
* set desired admin for transfer-emission-manager to support polygon crosschain bridge ([13ffce8](https://www.github.com/aave/aave-v3-deploy/commit/13ffce8890d805cb2e2985b6174f807523b72bf6))
* set supply caps of stablecoins to 2 billion, add better formatting to review-supply-caps task ([f8514b8](https://www.github.com/aave/aave-v3-deploy/commit/f8514b8c031bf65d6c5441a2dde786c58aa00d1e))
* Split transfer protocol ownership in three tasks. Added a new task for better visibility of current ownership of the different roles. ([57ddbc9](https://www.github.com/aave/aave-v3-deploy/commit/57ddbc9e00d872d732e22ac0e120f49da1441c67))
* Support to change DEFAULT_ADMIN_ROLE at transfer-acl-roles task ([d91dcdc](https://www.github.com/aave/aave-v3-deploy/commit/d91dcdc63b972997a8fb09d950c5351a83548b10))
* toggle borrow task ([62fff38](https://www.github.com/aave/aave-v3-deploy/commit/62fff383ebd62a8d7ef7458711d3c4c3ef330ed8))


### Bug Fixes

* acl setup ([b73355d](https://www.github.com/aave/aave-v3-deploy/commit/b73355d839ec06aeaab4eaa0c3f859b47573fdac))
* add await tx between disable of borrow ([6b9d5da](https://www.github.com/aave/aave-v3-deploy/commit/6b9d5da2b18951c3c0a511d6005ae42836ba6d26))
* add emergency rate strategy to stop accruing debt at Aave V3 Harmony ([7538bc7](https://www.github.com/aave/aave-v3-deploy/commit/7538bc704a62e2c10827fc03eb6cfebf80b5d851))
* add missing import ([fc93a3c](https://www.github.com/aave/aave-v3-deploy/commit/fc93a3c3a73d564743dda900c4d6b4ebd42b75a0))
* debt ceilings config ([2f5a08b](https://www.github.com/aave/aave-v3-deploy/commit/2f5a08be20c6c7a6353ab11affb1fb7b82300b8d))
* default param ([494817d](https://www.github.com/aave/aave-v3-deploy/commit/494817da1d9a44821473f5e76b720f57a6275caf))
* delete unused typings ([ed23418](https://www.github.com/aave/aave-v3-deploy/commit/ed23418da99203dced6ab686e358c1d4145a2eaa))
* disable stable borrowing for volatile assets ([3eb3240](https://www.github.com/aave/aave-v3-deploy/commit/3eb324084ea3e674e0d4eaf6be3dae04bf4bd668))
* fix review-rate-strategies task to support not normalized token symbols ([e0b51ec](https://www.github.com/aave/aave-v3-deploy/commit/e0b51ec787061e834e96d8e607cc74b2b929f107))
* npm issue ([b1539d9](https://www.github.com/aave/aave-v3-deploy/commit/b1539d9effe5170df28bd1895a8e52663f5938db))
* remove mandatory deterministic deployment ([9ef5e41](https://www.github.com/aave/aave-v3-deploy/commit/9ef5e41410c9b8549b5dc26aa5ea12e84b739cf1))
* remove missing variable ([7ed1cce](https://www.github.com/aave/aave-v3-deploy/commit/7ed1cce130be30338365424d6ab87fe982e0d174))
* remove unused parameter ([5ee75b2](https://www.github.com/aave/aave-v3-deploy/commit/5ee75b288cd43cf491a0dc5a1017d47484331d8c))
* rename to disable due could cause bad config of assets where stable is not enabled at risk params ([999bf37](https://www.github.com/aave/aave-v3-deploy/commit/999bf37c7506c64e46887beeef89efd59dfcf310))
* review rate strategies flip diff ([42c7531](https://www.github.com/aave/aave-v3-deploy/commit/42c7531638fcb5a9ff5889f4b7d5417703a9b40e))
* toggle task parse boolean ([1b191c5](https://www.github.com/aave/aave-v3-deploy/commit/1b191c592736ff1f32d8715b87cbba690e450d8b))
* use same slopes for stable rate at RateStrategyVolatileOne ([feb173f](https://www.github.com/aave/aave-v3-deploy/commit/feb173fa66afdbf4a694217d0f031d8e3e657b46))

## [1.24.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.23.0...v1.24.0) (2022-03-10)


### Features

* add Aave Market to all market ids. Add missing mockup prices at constants ([efedf0a](https://www.github.com/aave/aave-v3-deploy/commit/efedf0a233400252ed2912ddbd3559dc6c29ae94))
* add hardhat network signed tx factory, remove mandatory usage of factory for addresses provider, add DETERMINISTIC_DEPLOYMENT flag for pm2 script ([5eca64f](https://www.github.com/aave/aave-v3-deploy/commit/5eca64f88ba9522d1ea28a2a69102a06c1aac13e))
* Add new singleton CREATE2 factory settings ([66dbc99](https://www.github.com/aave/aave-v3-deploy/commit/66dbc99e1665ad5e01f66903eaa293a2cc7f3ccd))
* add polygon singleton signed tx ([ce52de4](https://www.github.com/aave/aave-v3-deploy/commit/ce52de4c88a89acf4894d0ea8b3626032290e338))
* keep deterministicDeployment flag disabled by default ([295621e](https://www.github.com/aave/aave-v3-deploy/commit/295621e43822c7e8e3b7709565ecd34577f1b312))
* skip incentives tx if payload is empty ([e86c4ab](https://www.github.com/aave/aave-v3-deploy/commit/e86c4ab94e0bf96003d5ef3ea5fac52d3e220abc))


### Bug Fixes

* Fix config values of AAVE in Polygon ([9be8f1e](https://www.github.com/aave/aave-v3-deploy/commit/9be8f1eb480619bad6882d7121b17fdaf1c3cfc5))
* Fix configuration of rate strategies ([994a9ab](https://www.github.com/aave/aave-v3-deploy/commit/994a9ab518a8d10d7acf2a60e8ee55d404302598))
* Fix liquidationBonus value of WBTC in Avalanche ([a1d690c](https://www.github.com/aave/aave-v3-deploy/commit/a1d690c584d93a3b720aae6dcf25c8e3935b1044))
* Fix liquidationBonus value of WBTC in Polygon ([7f279c9](https://www.github.com/aave/aave-v3-deploy/commit/7f279c9586d7ff1b578dcb773e253c9fb43ecdc0))
* Fix rate strategy of USDC in avalance and fantom ([bab755a](https://www.github.com/aave/aave-v3-deploy/commit/bab755af07709e495f7914b75eaa8bb721926ffe))
* Fix reserveFactor value of SUSHI in Polygon ([585fe5c](https://www.github.com/aave/aave-v3-deploy/commit/585fe5cb2a005c3a8540d025976cb8dda60b6309))
* Fix stablecoins Emode of Polygon ([18bfef9](https://www.github.com/aave/aave-v3-deploy/commit/18bfef92c88b54efaaeeb91657dbc4d17a9a6b7d))
* Fix USDC config values in Polygon ([969c50a](https://www.github.com/aave/aave-v3-deploy/commit/969c50a29bed3b225ec02bb788cb2e6992f4ac77))
* Fixed the stableBorrowRateEnabled value of CRV in Polygon ([69bd4ee](https://www.github.com/aave/aave-v3-deploy/commit/69bd4ee72e0362bc9cbdc2a0e25190eee0002e64))
* gas prices fantom singleton ([8ebbd88](https://www.github.com/aave/aave-v3-deploy/commit/8ebbd881c05af1db3739d56b5e9b7eb8783bee25))
* minor edge case while saving pool and configurator proxy artifacts ([a75966a](https://www.github.com/aave/aave-v3-deploy/commit/a75966a77cdcadedd08f55a33bd54dc4a30f8ca9))
* skip rewards strategy lookup before getting rewards type ([22601bd](https://www.github.com/aave/aave-v3-deploy/commit/22601bd37acb4e15dd247048b3509af686281645))
* tests after name change ([8c80314](https://www.github.com/aave/aave-v3-deploy/commit/8c80314f687c5b6b0cb5ca7d226701202486baba))
* variableDebtTokenName remove symbol prefix at name ([a03c057](https://www.github.com/aave/aave-v3-deploy/commit/a03c057bceb30c94112031876f20426f64af65c3))

## [1.23.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.22.0...v1.23.0) (2022-03-07)


### Features

* added liquidation protocol fee script ([8260075](https://www.github.com/aave/aave-v3-deploy/commit/8260075efbf95f6bb267970dcdbbc4a71ab12856))
* Update Polygon, Optimism and Harmony configs ([adc46dd](https://www.github.com/aave/aave-v3-deploy/commit/adc46ddeb938f23eca0af301350a68e601c35501))
* Updated Arbitrum, Avalanche, Fantom markets ([5cfe85d](https://www.github.com/aave/aave-v3-deploy/commit/5cfe85d10109012bf9b2a34ac556b5061a9d4867))


### Bug Fixes

* add missing SUSHI and CRV addresses ([f6f8ca1](https://www.github.com/aave/aave-v3-deploy/commit/f6f8ca17706c1935ea16b0bde3eb3706d0e0e141))
* adjust emode ([1800511](https://www.github.com/aave/aave-v3-deploy/commit/18005116b723c8caed0d9fc425f7bbc79d74dfdc))
* delete bad import ([dd39d8c](https://www.github.com/aave/aave-v3-deploy/commit/dd39d8cf4d0438e341bdb22639f8662f02402658))
* fixed stable rate slopes ([56cf1d1](https://www.github.com/aave/aave-v3-deploy/commit/56cf1d1c9c6742f908abe09ba459cee19ee5c543))

## [1.22.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.21.0...v1.22.0) (2022-03-07)


### Features

* add create2 factory config ([ccf61e8](https://www.github.com/aave/aave-v3-deploy/commit/ccf61e88375e85336d16dbc7879a3cfe4f8c3140))
* add support for create2 deployments. adapt deploy scripts to new owner constructor parameters. Make 6_init_pool script more protected against network issues and retries. ([147aaef](https://www.github.com/aave/aave-v3-deploy/commit/147aaef6a4b3d4f0e438b8daa1abbd00556f8757))
* change Factory deployer settings, set automatic gas price discovery for hardhat forks ([cf854f6](https://www.github.com/aave/aave-v3-deploy/commit/cf854f669d7af0507755a88ac1fa968663fa799c))
* refactored emode price source to allow conditional configuration ([d4685e9](https://www.github.com/aave/aave-v3-deploy/commit/d4685e9239d1e5669ccf72e4c78eff29c34a8539))


### Bug Fixes

* prevent CREATE2 in manually deployed proxies ([1457293](https://www.github.com/aave/aave-v3-deploy/commit/1457293b7f452abfa04bf5a2905e057083049824))

## [1.21.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.20.0...v1.21.0) (2022-03-02)


### Features

* take predence of ENABLE_REWARDS env varible if not undefined. Fix FlashLoanPremiums configuration ([6ed1253](https://www.github.com/aave/aave-v3-deploy/commit/6ed1253b9d85e596469b8b80e3eef36598f4267f))

## [1.20.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.19.0...v1.20.0) (2022-03-02)


### Features

* env variable ENABLE_REWARDS will be considered first over configuration to enable incentives ([4b1e927](https://www.github.com/aave/aave-v3-deploy/commit/4b1e927af21da3500c294ba24a7c352b14102bac))

## [1.19.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.18.1...v1.19.0) (2022-03-02)


### Features

* add FlashLoanPremium update and config ([42fb3da](https://www.github.com/aave/aave-v3-deploy/commit/42fb3daf6df20bf3d2b0b1ec94f088dcdac41d02))

### [1.18.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.18.0...v1.18.1) (2022-03-02)


### Bug Fixes

* enable incentives at test market ([f8db282](https://www.github.com/aave/aave-v3-deploy/commit/f8db28214d137a15cf7de231d3d7ca45a92cd29f))

## [1.18.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.17.0...v1.18.0) (2022-03-02)


### Features

* add collector and paraswap deploy scripts ([0bb45b8](https://www.github.com/aave/aave-v3-deploy/commit/0bb45b897f56c1f2dca5c4e891662782a0c87473))
* add Harmony price feeds ([73091ae](https://www.github.com/aave/aave-v3-deploy/commit/73091aeaaf6359ba32e0b9e0a4f332e505168770))
* add L2 deployment scripts and initial configuration. Add PM2 scripts. ([ee634c9](https://www.github.com/aave/aave-v3-deploy/commit/ee634c933001bf6a3a47891fb61af9d7093e705d))
* add more markets config, fix incentives for non aave stake networks ([9b40422](https://www.github.com/aave/aave-v3-deploy/commit/9b404224eb507b3f1fdfeda8fedc945abd69fbee))
* added deploy fns and getters, added L2 contracts to compiler dependencies ([28afa2b](https://www.github.com/aave/aave-v3-deploy/commit/28afa2bcf0ed053f2465a3b48aeb8387166bc874))
* added pm2 scripts for parallel cross-chain deployments ([b6b6066](https://www.github.com/aave/aave-v3-deploy/commit/b6b6066e7d6552b746a2495e2a1591e6424e3cae))
* automatize incentives configuration, fix paraswap error for non production deployments. ([770722e](https://www.github.com/aave/aave-v3-deploy/commit/770722ea2370d53b2d26b3baa4ea4d51b3369286))
* bump core-v3 version ([707a085](https://www.github.com/aave/aave-v3-deploy/commit/707a0851b64c0c202dce62f20253c2e6bb90d547))
* change deployer addresses index ([0312fc4](https://www.github.com/aave/aave-v3-deploy/commit/0312fc4143970fe0ce6ac18a66dccec107e695d6))
* remove extra incentives for testnet releases ([1a84b5a](https://www.github.com/aave/aave-v3-deploy/commit/1a84b5ae5a6634114bcd2e51a06cc7b30a61f165))
* support L2Pool deployment ([9a25373](https://www.github.com/aave/aave-v3-deploy/commit/9a253732c0a491622c0459334c575afa4cdfd207))


### Bug Fixes

* harmony price feeds ([e0c7541](https://www.github.com/aave/aave-v3-deploy/commit/e0c7541e1a6b7b75eff5e62a599932661cf17cf6))

## [1.17.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.16.0...v1.17.0) (2022-01-25)


### Features

* bump core-v3 ([67273eb](https://www.github.com/aave/aave-v3-deploy/commit/67273ebd3873693f0182416667fc7485d95020b9))
* skip initialized reserves ([80a49ce](https://www.github.com/aave/aave-v3-deploy/commit/80a49ce428addfcade8bd7c3b11933af011a0891))

## [1.16.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.15.0...v1.16.0) (2022-01-25)


### Features

* Add Polygon market config. Changes to hardhat config helper. ([e79d582](https://www.github.com/aave/aave-v3-deploy/commit/e79d582575d40700f75754845af5b2e5d135a043))
* Add PoolLogic and append to Pool deployment ([c2b2f7f](https://www.github.com/aave/aave-v3-deploy/commit/c2b2f7f97e7b478f59c4537a6bc1c9448599bda5))


### Bug Fixes

* missing library at contract getter ([61d33e8](https://www.github.com/aave/aave-v3-deploy/commit/61d33e8c0697c54f4c1a3dda5952a9640d663614))

## [1.15.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.14.1...v1.15.0) (2022-01-12)


### Features

* added chainlink oracles for native/usd and eth/usd ([51a325b](https://www.github.com/aave/aave-v3-deploy/commit/51a325ba584afe165b47e3411c943bc1ce143d2f))
* added deploy ui helper task ([0b76b55](https://www.github.com/aave/aave-v3-deploy/commit/0b76b55611d212867d5ceaf6d2d0f1110b88f8c7))


### Bug Fixes

* Add the correct symbol of Testnet WETH9 for other networks ([a72c886](https://www.github.com/aave/aave-v3-deploy/commit/a72c886713898f1a876f36526d3d8d268cb7d085))
* spaces ([824c5d8](https://www.github.com/aave/aave-v3-deploy/commit/824c5d864feb89451d87206be45e5f68801f2e08))

### [1.14.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.14.0...v1.14.1) (2022-01-07)


### Bug Fixes

* add missing LINK reserve for test market ([239506d](https://www.github.com/aave/aave-v3-deploy/commit/239506d4bbf02ac3173e02f2c73887f8201c06a7))

## [1.14.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.13.1...v1.14.0) (2022-01-07)


### Features

* export signer utilities ([805970e](https://www.github.com/aave/aave-v3-deploy/commit/805970ec29a740eb9ce8e9b1ccacd8c7f13f41e0))

### [1.13.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.13.0...v1.13.1) (2022-01-07)


### Bug Fixes

* support deployment of markets without incentives ([08ebe82](https://www.github.com/aave/aave-v3-deploy/commit/08ebe82853713af804b2fd7446e6d69176aac4cd))

## [1.13.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.12.1...v1.13.0) (2022-01-07)


### Features

* add ENABLE_REWARDS env to force the setup of rewards. Disable rewards by default at test market config. ([8fd26f9](https://www.github.com/aave/aave-v3-deploy/commit/8fd26f9453b3b55f1341ce6b5229103aacef4827))

### [1.12.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.12.0...v1.12.1) (2022-01-07)


### Miscellaneous Chores

* release 1.12.1 ([c929be5](https://www.github.com/aave/aave-v3-deploy/commit/c929be50cc41575d38e8fa31d71ef550dad9efca))

## [1.12.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.11.0...v1.12.0) (2022-01-07)


### Features

* add default named accounts constant ([83b4ee9](https://www.github.com/aave/aave-v3-deploy/commit/83b4ee9f69058c3e9619346e3c7dcef3b2449c30))


### Bug Fixes

* fix bad import ([c4b048f](https://www.github.com/aave/aave-v3-deploy/commit/c4b048fbdd10afc7ba8f25f30390df401d13b1fe))
* Rename utilizationRate to usageRatio ([d6e22b5](https://www.github.com/aave/aave-v3-deploy/commit/d6e22b588c186fdb47011665544b060329345c3d))

## [1.11.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.10.0...v1.11.0) (2022-01-07)


### Features

* improve @aave/deploy-v3 portability via removing ethers artifact discovery that breaks deploy exports ([e6bc79b](https://www.github.com/aave/aave-v3-deploy/commit/e6bc79b329731425bc6e1799be532099d17c3c3f))

## [1.10.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.9.0...v1.10.0) (2022-01-03)


### Features

* added e-mode, isolation and debt ceiling tasks for production deployments ([a66cc41](https://www.github.com/aave/aave-v3-deploy/commit/a66cc4171b2e105d36b5cb60b5a762b238cb9503))


### Bug Fixes

* bad import ([2aafe56](https://www.github.com/aave/aave-v3-deploy/commit/2aafe561cc3a80ee3eb324cb18497d2c7208fafa))

## [1.9.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.8.0...v1.9.0) (2021-12-27)


### Features

* bump core and periphery dependencies, fix uipooldataprovider name change ([48dff52](https://www.github.com/aave/aave-v3-deploy/commit/48dff521bf9b473a6e520859ebc288eee6498b8c))

## [1.8.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.7.1...v1.8.0) (2021-12-23)


### Features

* remove unused config, added usdt and eurs to current config ([df6e073](https://www.github.com/aave/aave-v3-deploy/commit/df6e073cadbb3397df7ab90a00250ed24746c023))


### Bug Fixes

* duplicated IERC20Detailed artifact reference ([7fbad55](https://www.github.com/aave/aave-v3-deploy/commit/7fbad5526b5739faa2f381196902227e163304a5))
* enforce node 16, fix contract deploy helper, print accounts before deployment ([426801c](https://www.github.com/aave/aave-v3-deploy/commit/426801cf5a98c9cbf675de8457a85b8fd037c1c8))
* fix broken periphery package ([28807f6](https://www.github.com/aave/aave-v3-deploy/commit/28807f6e435b5713b9bfc2a392069729b07c5c80))
* rewards vault missing approval, adjusted testnet emission ([dca4ce6](https://www.github.com/aave/aave-v3-deploy/commit/dca4ce67d5cd7e94bb3efad30ef6e9a3e42c64b7))
* testnet post-setup ([f72ae92](https://www.github.com/aave/aave-v3-deploy/commit/f72ae921b20a47ff8996c1e46f36391ed0c7b628))

### [1.7.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.7.0...v1.7.1) (2021-12-03)


### Bug Fixes

* collisions with main deployment ([c5de34e](https://www.github.com/aave/aave-v3-deploy/commit/c5de34e8541550a035d2b0ee7e831c95cf52638c))

## [1.7.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.6.0...v1.7.0) (2021-12-03)


### Features

* Replace all typechain deployers and getters helpers for hardhat-deploy ([b238412](https://www.github.com/aave/aave-v3-deploy/commit/b2384128877c87ce2b1edcfb1893fcc58b7cbad2))

## [1.6.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.5.0...v1.6.0) (2021-11-29)


### Features

* added PoolAddressesProvider address argument at Pool deployment script. Move pool implementations outside of core dir. ([b7b9608](https://www.github.com/aave/aave-v3-deploy/commit/b7b9608ce51243cddaed7074046a3ba26b5c5db7))
* use official core-v3 package ([d0c08a2](https://www.github.com/aave/aave-v3-deploy/commit/d0c08a2dfd3a43361d05b6ea6745286c940301c6))

## [1.5.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.4.0...v1.5.0) (2021-11-22)


### Features

* add unpause at the end of testnet deployment ([510a052](https://www.github.com/aave/aave-v3-deploy/commit/510a052eee9738ab9d835cf94d001adf598b9f28))
* added post-deployment config testnet ([d484f8f](https://www.github.com/aave/aave-v3-deploy/commit/d484f8f7fbc79db4d093cafd2b2438f36a2e4967))
* bump periphery dev dependency. added contracts cache dir to gitignore ([258ffc8](https://www.github.com/aave/aave-v3-deploy/commit/258ffc881e85ed473a2a6dfc50113de2701a82e6))


### Bug Fixes

* remove use of hardhat/ethers artifact path discovery for getWETHGateway getter ([1fa6977](https://www.github.com/aave/aave-v3-deploy/commit/1fa6977aa31a01e7c0b710ba83a71e6e1376f0c0))

## [1.4.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.3.0...v1.4.0) (2021-11-15)


### Features

* Use wrapped token symbol from config ([d9a2497](https://www.github.com/aave/aave-v3-deploy/commit/d9a2497c6cce3f82c176b10d2971b6a39debf082))

## [1.3.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.2.1...v1.3.0) (2021-11-15)


### Features

* add WalletBalanceProvider getter ([25c89a3](https://www.github.com/aave/aave-v3-deploy/commit/25c89a3e37bf08d8a15270787b451831f3ce3d6c))
* added periphery getters ([4e4f26f](https://www.github.com/aave/aave-v3-deploy/commit/4e4f26f02f86cdf116a35bc0c6ed4b35c84bbfeb))

### [1.2.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.2.0...v1.2.1) (2021-11-15)


### Bug Fixes

* fixes tests scripts. ([cf3b5ab](https://www.github.com/aave/aave-v3-deploy/commit/cf3b5ab085afee3cf5400c0d70dee761f51fb430))

## [1.2.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.1.0...v1.2.0) (2021-11-15)


### Features

* Add minor local tests for faucet, skip ui helpers if config not found for local deployments ([09613da](https://www.github.com/aave/aave-v3-deploy/commit/09613daa2cf58d5c514ffae642436cdb7793b58c))


### Bug Fixes

* update core-v3 dependency to match MintableERC20 to Faucet interface ([8c9d651](https://www.github.com/aave/aave-v3-deploy/commit/8c9d65173659fd5d2f08d825f5886abb0ecb526e))

## [1.1.0](https://www.github.com/aave/aave-v3-deploy/compare/v1.0.3...v1.1.0) (2021-11-11)


### Features

* move ui data provider helpers to periphery deployments ([0c66834](https://www.github.com/aave/aave-v3-deploy/commit/0c66834a9c968627b10b66dc4fdab2c13f4cc560))
* Save extended artifact of proxies and aave tokens for future verification ([2252fcf](https://www.github.com/aave/aave-v3-deploy/commit/2252fcf5ff0594d6f66ddc18d2376c8940931270))


### Bug Fixes

* use abstract network to grab fork network id ([9abc128](https://www.github.com/aave/aave-v3-deploy/commit/9abc128f4e237433cfc7a1a558253eeb63c648cf))

### [1.0.3](https://www.github.com/aave/aave-v3-deploy/compare/v1.0.2...v1.0.3) (2021-11-10)


### Bug Fixes

* export artifacts at npm package ([50236a2](https://www.github.com/aave/aave-v3-deploy/commit/50236a26e79bbffe6edf95faeef1941f80194bb8))

### [1.0.2](https://www.github.com/aave/aave-v3-deploy/compare/v1.0.1...v1.0.2) (2021-11-10)


### Bug Fixes

* fix package.json registry ([c28fd6d](https://www.github.com/aave/aave-v3-deploy/commit/c28fd6d8d3ed23b8133e6d27a97b54f390ba7432))

### [1.0.1](https://www.github.com/aave/aave-v3-deploy/compare/v1.0.0...v1.0.1) (2021-11-10)


### Bug Fixes

* fix release workflow file ([57f6fb0](https://www.github.com/aave/aave-v3-deploy/commit/57f6fb0432c32be6952efcbdf06cf1550b4fbffd))

## 1.0.0 (2021-11-10)


### Features

* adapt latest changes to deployment scripts ([bb5483f](https://www.github.com/aave/aave-v3-deploy/commit/bb5483fa5e2aa65ae312a77157bf71c057357e58))
* Added current market config,  hardhat deploy scripting wip ([759d6ad](https://www.github.com/aave/aave-v3-deploy/commit/759d6ad869b1bcd5b406d6151e2fe854a1836b2d))
* Added please release integration. Publish aave-v3 deploy ([2c737e8](https://www.github.com/aave/aave-v3-deploy/commit/2c737e83152a1b9470010874e76d9fa30e1c1efa))
* Added tests, adjusted dependencies, added ci pipeline ([acd4f16](https://www.github.com/aave/aave-v3-deploy/commit/acd4f165e802eb057cf7de51d3e23ca4306af745))
* allow @aave/v3-deploy to be imported in other repositories ([0337f6f](https://www.github.com/aave/aave-v3-deploy/commit/0337f6fdda17598b270402b2c4349c60f04107f7))
* Deploy USD mock oracles. Allow markets to be deployed localy for test deployments. ([85beda0](https://www.github.com/aave/aave-v3-deploy/commit/85beda013eadcc9b2b0f4f71a95ad046d211693d))
* Fix deployment script execution. Added before and after deploy scripts. Added README.md with information about the repository. ([47f959a](https://www.github.com/aave/aave-v3-deploy/commit/47f959a318b0169046647ad630c377ab6c5d5092))
* initial deployment setup and dependencies ([c1f8d76](https://www.github.com/aave/aave-v3-deploy/commit/c1f8d76ddd085b23446fa19e372c6fe79550e7ad))
* refactor market registry to allow deploy scripts to be portable ([0256e77](https://www.github.com/aave/aave-v3-deploy/commit/0256e77f925bb2810e284818643e4426360031c4))
* remove unused imports ([d5f8e95](https://www.github.com/aave/aave-v3-deploy/commit/d5f8e957214237584b5d754ab6a762f6527f63b0))
* Revised README.md getting started. Added NPM commands ([a46aa77](https://www.github.com/aave/aave-v3-deploy/commit/a46aa77636bb4f80c5f9cc3e980838ba1bfcae23))
* support avalanche testnet deployment ([79a67e3](https://www.github.com/aave/aave-v3-deploy/commit/79a67e3d87d125f9f0dd1843ae399299896bf72e))
* support core-v3 testnet deployment, migratedcontract-deployments scripts ([14aa687](https://www.github.com/aave/aave-v3-deploy/commit/14aa6873dee22b1bdff7046767ec8fb152724560))
* support latest core and periphjery packages. ([60e12ce](https://www.github.com/aave/aave-v3-deploy/commit/60e12ce59662b40aae0d619702e0e6d4cf410c2b))
* Update contracts deployment to support latest core and periphery changes ([5d1115e](https://www.github.com/aave/aave-v3-deploy/commit/5d1115e094ad809d052fa3a9526c73317b65a66c))
* use erc20mintable from core v3, import dependiencies via hardhat-dependency-compoler ([7244043](https://www.github.com/aave/aave-v3-deploy/commit/72440431c63d7f40c108b321651948f923e42c27))
* Use global hre instead of implicit import or abstracted HRE. Remove DRE usage. ([32f59aa](https://www.github.com/aave/aave-v3-deploy/commit/32f59aab82ed8a01de1330741611b0fdecd7e409))
* use namedAccounts intead of market config for acl roles, remove unneded typings ([db571a7](https://www.github.com/aave/aave-v3-deploy/commit/db571a76f5a9bd38d0cb33545f94e10460581733))


### Bug Fixes

* add missing  MARKET_NAME to test npm script ([46511a5](https://www.github.com/aave/aave-v3-deploy/commit/46511a52416245b232f339e2c6bb67b2dce522b5))
* use @aave/core-v3 library ([ea12cfe](https://www.github.com/aave/aave-v3-deploy/commit/ea12cfef44e33629f753f3cf3b90981797e17565))
* use same live checks as testnet tokens deployments ([0e1a9f5](https://www.github.com/aave/aave-v3-deploy/commit/0e1a9f5b63e10a633e3807e306d890050b3423d1))
