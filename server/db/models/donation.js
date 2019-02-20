const Sequelize = require('sequelize')
const db = require('../db')

const Donation = db.define('donation', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM(['connected', 'notConnected']),
    defaultValue: 'notConnected'
  },
  product: {
    type: Sequelize.STRING,
    allowNull: false
  },
  recipient: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contributors: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  currentAmount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  targetAmount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  instanceAddress: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  image: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    validate: {
      isUrl: true
    },
    defaultValue: [
      'https://www.qgiv.com/blog/wp-content/uploads/2016/04/Nonprofits.jpg'
    ]
  }
})

module.exports = Donation
