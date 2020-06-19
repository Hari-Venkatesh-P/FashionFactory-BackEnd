const router = require('express').Router()

const UserService = require('../Services/UserService')

router.post("/",UserService.addUser)
router.get("/:id",UserService.getUserById)
router.get("/",UserService.getAllUsers)
router.post("/login",UserService.loginUser)


 
module.exports = router;