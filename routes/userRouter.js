const userController = require("../controller/usercontroller")

const router = require("express").Router()

router.post('/addusers',userController.addusers)

router.get('/allusers',userController.getalluser)

router.get('/individualuser/:id',userController.getoneuser)

router.put('/updateuser/:id',userController.updateuser)

router.delete('/deleteuser/:id',userController.deleteuser)

module.exports = router
