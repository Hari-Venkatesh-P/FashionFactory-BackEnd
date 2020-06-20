const SubCategory = require('../Models/SubCategory')

const logger = require('../Library/logger')


async function getSubCategoryById(req,res){
    try{
        await SubCategory.findOne({_id:req.params.id},(err,subcategorydocs)=>{
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
                logger.info('SubCategory fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: subcategorydocs
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




async function getAllSubCategory(req,res){
    try{
        await SubCategory.find({},(err,allsubcategorydocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(allsubcategorydocs.length==0){
                logger.warn("No SubCategories found")
                res.status(201).send({
                    success: false,
                    message: 'No SubCategories found'
                })
            }else{
                logger.info('SubCategories fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: allsubcategorydocs
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

async function addSubCategory(req,res){
    try{
        await SubCategory.findOne({name:req.body.name},async (err,subcategorydocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(subcategorydocs!==null){
                logger.warn("SubCategory Already Exists")
                res.status(201).send({
                    success: false,
                    message: 'SubCategory Already Exists'
                })
            }else{
                const newsubCategory = new SubCategory({
                    name : req.body.name
                })
                await newsubCategory.save((err,docs)=>{
                    if(err){
                        logger.error(err)
                        res.status(502).send({
                            success: false,
                            message: 'DB Error'
                        })
                    }else{
                        logger.info(err)
                        res.status(200).send({
                            success: true,
                            message: 'SubCategory Created Successfully'
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
    getAllSubCategory,
    getSubCategoryById,
    addSubCategory,
}