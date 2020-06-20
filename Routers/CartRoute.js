const router = require('express').Router()
const MiddlewareService = require('../Middleware/Tokencheck')
const CartService = require('../Services/CartService')

router.post("/",MiddlewareService.isTokenPresent,CartService.addProductToCart)
router.get("/:userId",MiddlewareService.isTokenPresent,CartService.getProductsFromCart)
router.put("/",MiddlewareService.isTokenPresent,CartService.orderItemsFromCart)


router.get("/orders/forall",MiddlewareService.isTokenPresent,CartService.getProductsFromOrders)
router.get("/orders/:userId",MiddlewareService.isTokenPresent,CartService.getProductsFromOrdersById)


module.exports = router;