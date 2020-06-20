const router = require('express').Router()
const MiddlewareService = require('../Middleware/Tokencheck')

const ProductService = require('../Services/ProductService')

router.post("/",MiddlewareService.isTokenPresent,ProductService.productMulter,ProductService.addProduct)
router.get("/new",ProductService.getDefaultProducts)
router.get("/image/:file",ProductService.productImageDownload)
router.get("/:categoryId/:subcategoryId",ProductService.getFilteredProducts)
router.get("/:id",MiddlewareService.isTokenPresent,ProductService.getProductById)
router.delete("/:id",MiddlewareService.isTokenPresent,ProductService.deleteProduct) 
router.put("/:id",MiddlewareService.isTokenPresent,ProductService.updateProduct)

 
module.exports = router;