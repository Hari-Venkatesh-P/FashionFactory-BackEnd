const router = require('express').Router()
const MiddlewareService = require('../Middleware/Tokencheck')

const CategoryService = require('../Services/CategoryService')

router.post("/",MiddlewareService.isTokenPresent,CategoryService.addCategory)
router.get("/:id",MiddlewareService.isTokenPresent,CategoryService.getCategoryById)
router.get("/",CategoryService.getAllCategory)
router.put("/:categoryId/:subcategoryId",MiddlewareService.isTokenPresent,CategoryService.addSubCategoryToCategory)

module.exports = router;