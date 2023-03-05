const clientContoller = require("../controller/clientcontroller");
const router =require("express").Router();

router.post("/addclientuser",clientContoller.add_clientusers)

module.exports  = router
