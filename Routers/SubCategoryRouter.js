const router = require('express').Router()
const MiddlewareService = require('../Middleware/Tokencheck')

const SubCategoryService = require('../Services/SubCategoryService')

router.post("/",MiddlewareService.isTokenPresent,SubCategoryService.addSubCategory)
router.get("/:id",MiddlewareService.isTokenPresent,SubCategoryService.getSubCategoryById)
router.get("/",MiddlewareService.isTokenPresent,SubCategoryService.getAllSubCategory)

module.exports = router;