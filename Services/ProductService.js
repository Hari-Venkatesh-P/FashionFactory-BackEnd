const Category  = require('../Models/Category')
const Product  = require('../Models/Product')
const SubCategory = require('../Models/SubCategory')

const crypto = require('crypto')
const path = require('path')
const AWS = require('aws-sdk');
const multer  = require('multer')
const mongoose = require('mongoose')

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


var productMulter = multer({storage: storage}).array('productImage',2);


    function uploadProductPictureToAws(req, res){
    var i
    for(i=0;i<req.files.length;i++){
            logger.info("At Do Upload Function")
            //var file = req.files[i]
            //console.log(file)
            const hashBody = {
                file : req.files[i],
                body : req.body 
            }
            logger.info("Image Name at AWS")
            awsUploadParams.Key = crypto.createHash('sha1').update(JSON.stringify(hashBody)).digest('hex')+".png";
	        awsUploadParams.Body = req.files[i].buffer;
            try{
                s3Client.upload(awsUploadParams, (err, data) => {
                if (!err) {
                    logger.info('Product Image uploaded successfully !!')
                }else{
                    logger.warn(err)
                    logger.warn('Unable to save product image at AWS !!')
                }
                });
            }catch(error){
                logger.error('Error in Uploading the file ' +error)
            }
        }
    }

    function productImageDownload(req, res){

        awsDownloadParams.Key = req.params.file;
	s3Client.getObject(awsDownloadParams)
	  .createReadStream()
		.on('error', function(err){
            if(err){
                logger.warn('Error in Downloading the product image ' +err)
            }else{
                logger.info('Product image downloaded successfuly')
            }
	  }).pipe(res);
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
                                console.log(req.files)
                                console.log(req.file)
                                uploadProductPictureToAws(req,res)
                                const hashBody1 = {
                                    file : req.files[0],
                                    body : req.body
                                }
                                const hashBody2 = {
                                    file : req.files[1],
                                    body : req.body
                                }
                                newProduct = new Product({
                                name : req.body.name,
                                description:req.body.description,
                                price : req.body.price,
                                imageId: crypto.createHash('sha1').update(JSON.stringify(hashBody1)).digest('hex'),
                                imageId1: crypto.createHash('sha1').update(JSON.stringify(hashBody2)).digest('hex'),
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
        var id = mongoose.Types.ObjectId(req.params.id );
        console.log(req.params.id)
        await Product.aggregate([
            { $match: { _id:id } },
            { $addFields: { id: { $toObjectId: '$categoryId' } } },
            { $addFields: { categoryId: { $toObjectId: '$categoryId' } } },
            { $addFields: { subcategoryId: { $toObjectId: '$subcategoryId' } } },
            {
              $lookup: {
                from: 'categorydetails',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
              }
            },
            { $unwind: '$category' },
            {
                $lookup: {
                  from: 'subcategorydetails',
                  localField: 'subcategoryId',
                  foreignField: '_id',
                  as: 'subcategory'
                }
              },
              { $unwind: '$subcategory' }
          ]).exec((err,productdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
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
        await Product.find({categoryId,subcategoryId}).sort({createddate: -1}).exec(async (err,allproductdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
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
        console.log(req.body)
        await Product.findByIdAndUpdate(req.params.id,{ $set: { name: req.body.name , description: req.body.description, price: req.body.price, availableQuantity: req.body.availableQuantity, categoryId: req.body.categoryId, subcategoryId: req.body.subcategoryId  } },async (err,docs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(docs===null){
                logger.warn('No such Product to be Updated')
                res.status(201).send({
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

  async function getDefaultProducts(req,res){
      try {
        await Product.find({}).sort({createddate: -1}).limit(7).exec(function(err, docs) { 
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else{
                logger.info('Successfully retreived the latest products')
                res.status(200).send({
                    success: true,
                    message: docs
                })
            }
         })
      } catch (error) {
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
    getFilteredProducts,
    getDefaultProducts,
    productImageDownload
}