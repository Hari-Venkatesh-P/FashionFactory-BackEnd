const router = require('express').Router()

const ProductService = require('../Services/ProductService')

router.post("/",ProductService.productMulter,ProductService.addProduct)
router.get("/:categoryId/:subcategoryId",ProductService.getFilteredProducts)
router.get("/:id",ProductService.getProductById)
router.delete("/:id",ProductService.deleteProduct)
router.put("/:id",ProductService.updateProduct)

 
module.exports = router;