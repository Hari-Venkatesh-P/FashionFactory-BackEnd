const Category  = require('../Models/Category')
const Product  = require('../Models/Product')
const SubCategory = require('../Models/SubCategory')

const crypto = require('crypto')
const path = require('path')
const AWS = require('aws-sdk');
const multer  = require('multer')

const logger = require('../Library/logger')


const configuration = require('../configuration')

const aws = configuration.aws;

const s3Client = new AWS.S3({
    accessKeyId: aws.accesskey,
    secretAccessKey: aws.secretkey,
	region : aws.region,
});

const awsUploadParams = {
    Bucket: aws.bucket+'/'+aws.productimages, 
};

const awsDownloadParams = {
    Bucket: aws.bucket+'/'+aws.productimages, 
};

var storage = multer.memoryStorage()
var productMulter = multer({storage: storage}).single('productImage');


function uploadProductPictureToAws(req, res){
    const hashBody = {
        file : req.file,
        body : req.body 
    }
    logger.info("At Do Upload Function")
    //logger.info(hashBody)
    logger.info("Image Name at AWS")
    //logger.info(crypto.createHash('sha1').update(JSON.stringify(hashBody)).digest('hex'))
	awsUploadParams.Key = crypto.createHash('sha1').update(JSON.stringify(hashBody)).digest('hex')+".png";
	awsUploadParams.Body = req.file.buffer;
    try{
        s3Client.upload(awsUploadParams, (err, data) => {
            if (!err) {
                logger.info('Product Image uploaded successfully !!'+ req.file.originalname)
            }
        });
    }catch(error){
        logger.info('Error in Uploading the file ' +error)
    }
	
}


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
                                uploadProductPictureToAws(req,res)
                                const hashBody = {
                                    file : req.file,
                                    body : req.body
                                }
                                newProduct = new Product({
                                name : req.body.name,
                                description:req.body.description,
                                price : req.body.price,
                                imageId: crypto.createHash('sha1').update(JSON.stringify(hashBody)).digest('hex'),
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

  async function deleteProduct (req, res) {
    try {
        await Product.findByIdAndRemove({_id:req.params.id},async (err,docs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(docs===null){
                logger.warn('No such Product to be deleted')
                res.status(402).send({
                    success: false,
                    message: 'No such Product to be deleted'
                })
            }else{
                logger.info('Product deleted successfullyy')
                res.status(200).send({
                    success: true,
                    message: 'Product deleted successfullyy'
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


  async function updateProduct (req, res) {
    try {
        await Product.findByIdAndUpdate(req.params.id,{ $set: { name: req.body.name , description: req.body.description, price: req.body.price, availableQuantity: req.body.availableQuantity, categoryId: req.body.categoryId, subcategoryId: req.body.subcategoryId  } },async (err,docs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(docs===null){
                logger.warn('No such Product to be Updated')
                res.status(402).send({
                    success: false,
                    message: 'No such Product to be Updated'
                })
            }else{
                logger.info('Product Updated successfullyy')
                res.status(200).send({
                    success: true,
                    message: 'Product Updated successfullyy'
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
    productMulter,
    deleteProduct,
    updateProduct,
    getProductById,
    getFilteredProducts
}