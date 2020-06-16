const Category = require('../Models/Category')
const SubCategory = require('../Models/SubCategory')

const logger = require('../Library/logger')

async function addCategory(req,res){
    logger.info('Hit to addCategory API')

    try{
        await Category.findOne({name:req.body.name},async function(err,categorydocs){
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'Db Error'
                })
            }else if(categorydocs!==null){
                logger.warn('Category already exists')
                res.status(403).send({
                    success: false,
                    message: 'Category already exists'
                  })
            }else{
                const newCategory = new Category({
                   name : req.body.name,
                })
                await newCategory.save((err,docs)=>{
                    if (err) {
                        logger.error(err)
                        res.status(502).send({
                          success: false,
                          message: 'DB Error'
                        })
                    }else{
                        logger.info('Category Saved  successfully')
                        res.status(200).send({
                            success: true,
                            message: 'Category Saved  successfully'
                          })
                    }
                })
            }
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}


async function getCategoryById(req,res){
    try{
        await Category.findOne({_id:req.params.id},(err,categorydocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(categorydocs===null){
                logger.warn("No Category found")
                res.status(403).send({
                    success: false,
                    message: 'No Category found'
                })
            }else{
                logger.info('Category fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: categorydocs
                })
            }
        })
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}


async function getAllCategory(req,res){
    try{
        await Category.find({},(err,allcategorydocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(allcategorydocs.length==0){
                logger.warn("No Categories found")
                res.status(403).send({
                    success: false,
                    message: 'No Categories found'
                })
            }else{
                logger.info('Categories fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: allcategorydocs
                })
            }
        })
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}


async function addSubCategoryToCategory(req,res){
    try{
        await Category.findOne({_id:req.params.categoryId},async (err,categorydocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(categorydocs===null){
                logger.warn("No Category found")
                res.status(403).send({
                    success: false,
                    message: 'No Category found'
                })
            }else{
                console.log(req.params.subcategoryId)
                await SubCategory.findOne({_id:req.params.subcategoryId},async (err,subcategorydocs)=>{
                    console.log(subcategorydocs)
                    if(err){
                        logger.error(err)
                        res.status(502).send({
                            success: false,
                            message: 'DB Error'
                        })
                    }else if(subcategorydocs===null){
                        logger.warn("No SubCategory found")
                        res.status(403).send({
                            success: false,
                            message: 'No SubCategory found'
                        })
                    }else{
                        categorydocs.subcategory.push({_id: subcategorydocs._id, name: subcategorydocs.name});
                        categorydocs.save((err,docs)=>{
                            if(err){
                                logger.error(err)
                                res.status(502).send({
                                    success: false,
                                    message: 'DB Error'
                                })
                            }else{
                                logger.info('SubCategory added to category Successfully')
                                res.status(200).send({
                                    success: true,
                                    message: 'SubCategory added to Successfully'
                                })
                            }
                        })
                    }
                })
            }
        })
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}

module.exports={
    addCategory,
    getAllCategory,
    getCategoryById,
    addSubCategoryToCategory,
}