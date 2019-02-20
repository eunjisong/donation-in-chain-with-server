const assert = require('assert')

const ganache = require('ganache-cli')
const provider = ganache.provider()

const Web3 = require('web3')
const web3 = new Web3(provider)

const compiledFactory = require('./build/DonationFactory.json')
const compiledDonation = require('./build/Donation.json')

let accounts
let factory
let donation
let donationAddress

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  //let balance = web3.eth.getBalance(accounts[0])
  //console.log('initial balance', balance);

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0], gas: '1000000'})
  //console.log('after balance', balance);

  await factory.methods
    .createDonation(accounts[2], web3.utils.toWei('5', 'ether'), 'Goat')
    .send({from: accounts[1], gas: '1000000'})
  ;[donationAddress] = await factory.methods.getDeployedDonations().call()
  donation = await new web3.eth.Contract(
    JSON.parse(compiledDonation.interface),
    donationAddress
  )
})

describe('Factory', () => {
  require('events').EventEmitter.defaultMaxListeners = 0

  it('deployed the contracts', () => {
    assert.ok(factory)
    assert.ok(donation)
  })

  it('You can not send money to yourself', async () => {
    try {
      await factory.methods
        .createDonation(accounts[2], '1000', 'Bicycle')
        .send({from: accounts[2], gas: '1000000'})
    } catch (err) {
      assert(err)
    }
  })

  it('getDeployedDonation func work', async () => {
    await factory.methods
      .createDonation(accounts[2], '1000', 'Bicycle')
      .send({from: accounts[1], gas: '1000000'})
    const donations = await factory.methods.getDeployedDonations().call()
    assert.equal(donations.length, 2)
  })
})

describe('Donation', () => {
  it('injected all the input fields for Request struct', async () => {
    const request = await donation.methods.requests(0).call()
    console.log(request)
    assert.equal(accounts[2], request.recipient)
    assert.equal(web3.utils.toWei('5', 'ether'), request.targetAmount)
    assert.equal('Goat', request.product)
    assert.notEqual(accounts[0], request.recipient)
    assert.notEqual('1000', request.targetAmount)
    assert.notEqual('Goatttt', request.product)
  })

  it('has a correct requester', async () => {
    const requester = await donation.methods.requester().call()
    assert.equal(accounts[1], requester)
    assert.notEqual(accounts[0], requester)
    assert.notEqual(accounts[2], requester)
  })

  it('allow all users to donate', async () => {
    await donation.methods.donate(0).send({from: accounts[0], value: '10'})

    await donation.methods.donate(0).send({from: accounts[0], value: '20'})

    await donation.methods.donate(0).send({from: accounts[1], value: '5'})
    await donation.methods.donate(0).send({from: accounts[1], value: '30'})

    await donation.methods.donate(0).send({from: accounts[2], value: '10'})

    await donation.methods.donate(0).send({from: accounts[3], value: '10'})

    await donation.methods.donate(0).send({from: accounts[4], value: '5'})

    let count = await donation.methods.donatorsCount().call()
    let status = await donation.methods.status().call()
    const contractBal = await web3.eth.getBalance(donationAddress)
    const contribution0 = await donation.methods
      .getContribution(accounts[0])
      .call()
    const contribution1 = await donation.methods
      .getContribution(accounts[1])
      .call()
    assert.equal(5, count)
    assert.equal('pending', status)
    assert.equal(90, contractBal)
    assert.equal('30', contribution0)
    assert.equal('35', contribution1)
  })

  it('does not allow 0 to donate', async () => {
    try {
      await donation.methods.donate(0).send({from: accounts[0], value: '0'})
    } catch (err) {
      assert(err)
    }
  })

  it('does not allow to donate more than requested', async () => {
    try {
      await donation.methods.donate(0).send({from: accounts[0], value: '100'})
      await donation.methods.donate(0).send({from: accounts[0], value: '5'})
    } catch (err) {
      assert(err)
    }
  })

  it('changes the status', async () => {
    let pending = await donation.methods.status().call()
    assert.equal('pending', pending)
    await donation.methods
      .donate(0)
      .send({from: accounts[0], value: web3.utils.toWei('5', 'ether')})
    let ready = await donation.methods.status().call()
    assert.equal('ready', ready)
    await donation.methods.complete(0).send({from: accounts[1]})
    let complete = await donation.methods.status().call()
    assert.equal('completed', complete)
  })

  it('The donators mapping working fine', async () => {
    await donation.methods.donate(0).send({from: accounts[0], value: '100'})
    let donator = await donation.methods.getContribution(accounts[0]).call()
    let nonDonator = await donation.methods.getContribution(accounts[1]).call()

    assert.equal(100, donator)
    assert.equal(0, +nonDonator)
  })

  it('fails when other persons try to complete', async () => {
    try {
      await donation.methods.complete(0).send({from: accounts[0]})
    } catch (err) {
      assert(err)
    }
  })

  it('fails when targetAmount is not reached', async () => {
    await donation.methods.donate(0).send({from: accounts[0], value: '99'})
    try {
      await donation.methods.complete(0).send({from: accounts[1]})
    } catch (err) {
      assert(err)
    }

    const conBal = await web3.eth.getBalance(donationAddress)
    const req = await donation.methods.requests(0).call()
    assert.ok(+conBal < +req.targetAmount)
  })

  it('works the whole flow', async () => {
    // donate
    let initialBal = await web3.eth.getBalance(accounts[2])
    await donation.methods
      .donate(0)
      .send({from: accounts[0], value: web3.utils.toWei('3', 'ether')})
    assert.equal('pending', await donation.methods.status().call())
    await donation.methods
      .donate(0)
      .send({from: accounts[1], value: web3.utils.toWei('2', 'ether')})
    console.log(await web3.eth.getBalance(donationAddress))
    assert.equal(2, await donation.methods.donatorsCount().call())
    assert.equal('ready', await donation.methods.status().call())

    assert.equal(
      web3.utils.toWei('3', 'ether'),
      await donation.methods.getContribution(accounts[0]).call()
    )
    assert.equal(
      web3.utils.toWei('2', 'ether'),
      await donation.methods.getContribution(accounts[1]).call()
    )

    // complete
    try {
      await donation.methods.complete(0).send({from: accounts[2]})
    } catch (err) {
      assert(err)
    }

    await donation.methods.complete(0).send({from: accounts[1]})
    assert.equal('completed', await donation.methods.status().call())
    assert.equal('0', await web3.eth.getBalance(donationAddress))
    let afterSendingMoney = await web3.eth.getBalance(accounts[2])

    initialBal = web3.utils.fromWei(initialBal, 'ether')
    afterSendingMoney = web3.utils.fromWei(afterSendingMoney, 'ether')
    console.log('HIIIIII', initialBal, afterSendingMoney)
    assert(+afterSendingMoney > 104)
    assert.equal(donation.options.address, donationAddress)
  })
})
