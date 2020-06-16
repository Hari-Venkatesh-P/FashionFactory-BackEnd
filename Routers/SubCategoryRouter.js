const router = require('express').Router()

const SubCategoryService = require('../Services/SubCategoryService')

router.post("/",SubCategoryService.addSubCategory)
router.get("/:id",SubCategoryService.getSubCategoryById)
router.get("/",SubCategoryService.getAllSubCategory)

module.exports = router;