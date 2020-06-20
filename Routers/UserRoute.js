const router = require('express').Router()
const MiddlewareService = require('../Middleware/Tokencheck')

const UserService = require('../Services/UserService')

router.post("/",UserService.addUser)
router.get("/:id",MiddlewareService.isTokenPresent,UserService.getUserById)
router.get("/",MiddlewareService.isTokenPresent,UserService.getAllUsers)
router.post("/login",UserService.loginUser)
router.put("/",MiddlewareService.isTokenPresent,UserService.updateUser)

 
module.exports = router;