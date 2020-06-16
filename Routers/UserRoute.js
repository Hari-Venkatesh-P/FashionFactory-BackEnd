const router = require('express').Router()

const UserService = require('../Services/UserService')

router.post("/",UserService.addUser)
router.get("/:id",UserService.getUserById)
router.get("/",UserService.getAllUsers)


 
module.exports = router;