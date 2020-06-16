const router = require('express').Router()

const CategoryService = require('../Services/CategoryService')

router.post("/",CategoryService.addCategory)
router.get("/:id",CategoryService.getCategoryById)
router.get("/",CategoryService.getAllCategory)
router.put("/:categoryId/:subcategoryId",CategoryService.addSubCategoryToCategory)

module.exports = router;