const userController = require("../controller/usercontroller")

const router = require("express").Router()

router.post('/addusers_startup',userController.addusers_startup)

module.exports = router
