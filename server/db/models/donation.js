const Sequelize = require('sequelize')
const db = require('../db')

const Donation = db.define('donation', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  product: {
    type: Sequelize.STRING,
    allowNull: false
  },
  recipient: {
    type: Sequelize.STRING,
    allowNull: false
  },
  currentAmount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  targetAmount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  instanceAddress: {
    type: Sequelize.STRING,
    allowNull: false
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
