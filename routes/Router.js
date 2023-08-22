const Controller = require("../controller/controller")

const router = require("express").Router()

router.post('/signin',Controller.signin)
router.get('/fetchppm',Controller.fetchppm)
router.post('/forgotpassword',Controller.forgotpassword)


module.exports = router
