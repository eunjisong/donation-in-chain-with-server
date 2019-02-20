const solc = require('solc')
const path = require('path')
const fs = require('fs-extra')

// get path
const buildPath = path.resolve(__dirname, 'build')
const donationPath = path.resolve(__dirname, 'contracts', 'Donation.sol')

// delete all in build
fs.removeSync(buildPath)

// compile this file
const source = fs.readFileSync(donationPath, 'utf8')
const output = solc.compile(source, 1).contracts

// put the compiled to buill
fs.ensureDirSync(buildPath)

for (contract in output) {
  fs.outputJSONSync(
    path.resolve(__dirname, 'build', contract.replace(':', '') + '.json'),
    output[contract]
  )
}
