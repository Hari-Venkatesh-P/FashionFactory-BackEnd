const router = require('express').Router()

const ProductService = require('../Services/ProductService')

router.post("/",ProductService.addProduct)
router.get("/:categoryId/:subcategoryId",ProductService.getFilteredProducts)
router.get("/:id",ProductService.getProductById)
//router.get("/",ProductService.getAllProducts)

 
module.exports = router;