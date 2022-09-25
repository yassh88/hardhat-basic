const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect, assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  let simpleStorage
  beforeEach(async function () {
    const simpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    )
    simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()
  })
  it("check retrieve value", async function () {
    let value = await simpleStorage.retrieve()
    expect(value.toString()).to.equal("0")
  })
  it("set value and check retrieve value", async function () {
    await simpleStorage.store(89)
    let value = await simpleStorage.retrieve()
    assert.equal(value.toString(), "89")
  })
  it("add person and retrive that", async function () {
    const transactionResponse = await simpleStorage.addPerson("yashwant", 99)
    transactionResponse.wait(1)
    let value = await simpleStorage.nameToFavoriteNumber("yashwant")
    const { favoriteNumber, name } = await simpleStorage.people(0)
    assert.equal(value.toString(), "99")
    assert.equal(favoriteNumber.toString(), "99")
    assert.equal(name.toString(), "yashwant")
  })
})
