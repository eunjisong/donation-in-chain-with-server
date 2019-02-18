'use strict'

// factory address: 0xa0f2dbf68bebdf52e99cedd37214fb10d18b180c created by worldvision

// donation address:

const db = require('../server/db')
const {User, Donation} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      email: 'worldvision@email.com',
      password: '123',
      ethereumId: '0x2E5C25cC0b1e971eD22e22E6F349E8f3c9a3fF6a'
    }),

    User.create({
      email: 'unicef@email.com',
      password: '123',
      ethereumId: '0x7Bc188c6ab615bAADd247467e776C7936d6Ae3cE'
    }),

    User.create({
      email: 'amazon@email.com',
      password: '123',
      ethereumId: '0x8A6B29aA6dA10555115f989F99Be14b3fEC1f945'
    }),

    User.create({
      email: 'one@email.com',
      password: '123',
      ethereumId: '0x613BD02e57dd7C55e23CCA314Ea946B993CDC4eC'
    }),

    User.create({
      email: 'two@email.com',
      password: '123',
      ethereumId: '0x3834F2827610208327b45435E6a6A1A61e3Eb87e'
    }),

    User.create({
      email: 'three@email.com',
      password: '123',
      ethereumId: '0xBE88644856538CF4210597130594d509D507Ff4D'
    }),

    User.create({
      email: 'four@email.com',
      password: '123',
      ethereumId: '0x26c1a8fcf89c8dA6e7b00D163B0776b5b99f4289'
    })
  ])

  const donations = await Promise.all([
    Donation.create({
      description:
        'Jake needs sneakers. He walks on barefoot for hours to deliver milk.',
      product: 'Sneakers',
      userId: 1,
      currentAmount: 0,
      targetAmount: 1,
      recipient: '0x8A6B29aA6dA10555115f989F99Be14b3fEC1f945',
      instanceAddress: '0x5Dba8eF4712050d763B15B630D46b2f1474c7D81'
    }),
    Donation.create({
      description:
        "Children in Milkiki, Philiphine, wants to become engineers, doctors, teachers, scientist and etc, but they don'n have a school. Please support these children for their education.",
      product: 'School',
      userId: 1,
      currentAmount: 0,
      targetAmount: 10,
      recipient: '0x8A6B29aA6dA10555115f989F99Be14b3fEC1f945',
      instanceAddress: '0x4713eDac65e3Ef17AA3039DC1f9D667EF0fAC798'
    }),

    Donation.create({
      description:
        'Marnie wishes to have a goat to support her children. She recently lost her husband and became a sole caretaker of 5 children. Please help her to go through the tough state of life.',
      product: 'Goat',
      userId: 2,
      currentAmount: 0,
      targetAmount: 3,
      recipient: '0x8A6B29aA6dA10555115f989F99Be14b3fEC1f945',
      instanceAddress: '0xDEfeE806E2DF7CC0a1aa7a60349e26850850Fef6'
    }),
    Donation.create({
      description:
        'Phebe needs a small wagon for her crops. She is having a hard time to carry all and walk 20 miles to the market.',
      product: 'Small Wagon',
      userId: 2,
      currentAmount: 0,
      targetAmount: 2,
      recipient: '0x8A6B29aA6dA10555115f989F99Be14b3fEC1f945',
      instanceAddress: '0x6686796F5339bD7B1E406CFf2269E8A5Ac1c7F07'
    })
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${donations.length} donations`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
