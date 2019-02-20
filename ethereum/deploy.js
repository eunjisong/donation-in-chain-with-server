const meta = require('../secret')
const HDWalletProvider = require('truffle-hdwallet-provider')
provider = new HDWalletProvider(
  meta.twelve,
  'https://rinkeby.infura.io/v3/b511522af4e14268b390f2ce3745d0cb'
)

const Web3 = require('web3')
const web3 = new Web3(provider)

const compiled = require('./build/DonationFactory.json')

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  console.log('Attempting to deploy from account ', accounts[0])
  const output = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data: compiled.bytecode})
    .send({from: accounts[0], gas: '1000000'})

  console.log('Successfully deployed the contract at ', output.options.address)
}

deploy()
