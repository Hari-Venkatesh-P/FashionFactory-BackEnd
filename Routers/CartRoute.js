const router = require('express').Router()

const CartService = require('../Services/CartService')

router.post("/",CartService.addProductToCart)
router.get("/:userId",CartService.getProductsFromCart)
router.put("/:userId",CartService.orderCart)


router.get("/orders/forall",CartService.getProductsFromOrders)
router.get("/orders/:userId",CartService.getProductsFromOrdersById)


module.exports = router;