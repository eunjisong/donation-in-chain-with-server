const router = require('express').Router()
const {User, Donation} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email', 'ethereumId', 'donated']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const theUser = await User.findById(req.params.id, {include: [Donation]})
    res.json(theUser)
  } catch (err) {
    next(err)
  }
})
