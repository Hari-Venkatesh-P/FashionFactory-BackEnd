const Category  = require('../Models/Category')
const Product  = require('../Models/Product')
const SubCategory = require('../Models/SubCategory')

const logger = require('../Library/logger')

async function addProduct(req,res){
    try{
        await Category.findOne({_id:req.body.categoryId},async function(err,categorydocs){
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'Db Error'
                })
            }else if(categorydocs===null){
                logger.warn('No Category Found')
                res.status(403).send({
                    success: false,
                    message: 'No Category Found'
                  })
            }else{
                await SubCategory.findOne({_id:req.body.subcategoryId},async function(err,subcategorydocs){
                    if(err){
                        logger.error(err)
                        res.status(502).send({
                            success: false,
                            message: 'Db Error'
                        })
                    }else if(subcategorydocs===null){
                        logger.warn('No Subcategory  Found')
                        res.status(403).send({
                            success: false,
                            message: 'No SubCategory Found'
                          })
                    }else{
                        await Product.findOne({name:req.body.name,categoryId:categorydocs._id,subcategoryId:subcategorydocs._id},async function(err,productdocs){
                            if(err){
                                logger.error(err)
                                res.status(502).send({
                                    success: false,
                                    message: 'Db Error'
                                })
                            }else if(productdocs!==null){
                                logger.warn('Product already found in specified category under the subcategory')
                                res.status(403).send({
                                    success: false,
                                    message: 'Product already found in specified category under the subcategory'
                                  })
                            }else{
                               newProduct = new Product({
                                name : req.body.name,
                                price : req.body.price,
                                imageId: req.body.imageId,
                                availableQuantity: req.body.availableQuantity,
                                categoryId: categorydocs._id,
                                subcategoryId : subcategorydocs._id,
                               })
                               await newProduct.save((err,savedocs)=>{
                                if (err) {
                                    logger.error(err)
                                    res.status(502).send({
                                      success: false,
                                      message: 'DB Error'
                                    })
                                }else{
                                    logger.info('Product Saved  successfully')
                                    res.status(200).send({
                                        success: true,
                                        message: 'Product Saved  successfully'
                                      })
                                }
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



async function getProductById (req, res) {
    try {
        await Product.findOne({_id:req.params.id},async (err,productdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(productdocs===null){
                logger.warn("No Product found")
                res.status(403).send({
                    success: false,
                    message: 'No Product found'
                })
            }else{
                logger.info('Product fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: productdocs
                })
            }
        })
    }catch (error) {
      logger.error(error)
      res.status(500).send({
        success: false,
        message: error
      })
    }
  }



  /*async function getAllProducts (req, res) {
    try {
        await Product.find({},async (err,allproductdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(allproductdocs.length===0){
                logger.warn("No Product found")
                res.status(403).send({
                    success: false,
                    message: 'No Product found'
                })
            }else{
                logger.info('All Products fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: allproductdocs
                })
            }
        })
    }catch (error) {
      logger.error(error)
      res.status(500).send({
        success: false,
        message: error
      })
    }
  }*/


   async function getFilteredProducts(req, res) {
    try {
        const{categoryId,subcategoryId} = req.params
        await Product.find({categoryId,subcategoryId},async (err,allproductdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(allproductdocs.length===0){
                logger.warn("No Product found")
                res.status(403).send({
                    success: false,
                    message: 'No Product found'
                })
            }else{
                logger.info('All Products fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: allproductdocs
                })
            }
        })
    }catch (error) {
      logger.error(error)
      res.status(500).send({
        success: false,
        message: error
      })
    }
  }



module.exports = {
    addProduct,
    getProductById,
    getFilteredProducts
}