const router = require('express').Router()
const {Donation} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const donations = await Donation.findAll()
    res.json(donations)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const theDonation = await Donation.findOne({
      where: {instanceAddress: req.params.id}
    })
    res.json(theDonation)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newDonation = await Donation.create(req.body)
    res.json(newDonation)
  } catch (err) {
    next(err)
  }
})
