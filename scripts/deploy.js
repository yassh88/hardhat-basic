// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, run, network } = require("hardhat")

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
  console.log("deploye contract")
  const simpleStorage = await SimpleStorage.deploy()
  await simpleStorage.deployed()
  console.log(` deployed to ${simpleStorage.address}`)
  if (network.config.chainId === 5 && process.env.ETHERSCAN_KEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  let value = await simpleStorage.retrieve()
  console.log("value", value)
  const transactionResponse = await simpleStorage.store(89)
  await transactionResponse.wait(1)
  value = await simpleStorage.retrieve()
  console.log("udpated value", value)
}

async function verify(contracAddress, arg) {
  console.log("verifying contract")
  try {
    await run("verify:verify", {
      address: contracAddress,
      constructorArguments: arg,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
