const Cart = require('../Models/Cart')
const Product  = require('../Models/Product')

const logger = require('../Library/logger')

async function addProductToCart(req,res){
  try{
      const {userId,productId,quantity} = req.body
      console.log(req.body)
      await Product.findOne({_id:productId,availableQuantity: { $gt:quantity}},async function(err,productdocs){
          if(err){
              logger.error(err)
                  res.status(502).send({
                  success: false,
                  message: 'DB Error'
               })        
          }else if(productdocs===null){
              logger.warn("No Product found")
                  res.status(201).send({
                      success: false,
                      message: 'Product not available'
                  })
          }else{
               productdocs.availableQuantity = parseInt(productdocs.availableQuantity)-parseInt(quantity)
               productdocs.save(async (err,saveddocs)=>{
                   if(err){
                          logger.error(err)
                          res.status(502).send({
                              success: false,
                              message: 'DB Error'
                          })
                   }else{
                      await Cart.findOne({userid:userId,productid:productId,orderStatus:false },async function(err,cartdocs){
                      if(err){
                          logger.error(err)
                          res.status(502).send({
                          success: false,
                          message: 'DB Error'
                      })   
                      }else if(cartdocs===null){
                          const newCart = new Cart({
                              userid :  userId,
                              productid :  productId,
                              quantity : quantity,
                              price : ((productdocs.price)*(quantity)),
                              orderStatus : false,
                          })
                          await newCart.save((err,docs)=>{
                              if(err){
                                  logger.error(err)
                                  res.status(502).send({
                                          success: false,
                                          message: 'DB Error'
                                  })
                              }else{
                                  logger.info('Product Added to Cart Successfully')
                                  res.status(200).send({
                                          success: true,
                                          message: 'Product Added to Cart Successfully'
                                  })
                              }
                          })
                      }else{
                          var price = (parseInt(cartdocs.quantity)+quantity) * (parseInt(productdocs.price))
                          cartdocs.quantity = parseInt(cartdocs.quantity)+quantity,
                          cartdocs.price = price,
                          cartdocs.save((err,docs)=>{
                              if(err){
                                  logger.error(err)
                                  res.status(502).send({
                                      success: false,
                                      message: 'DB Error'
                                  })
                              }else{
                                  logger.info('Product Added to Cart Successfully')
                                  res.status(200).send({
                                          success: true,
                                          message: 'Product Added to Cart Successfully'
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
          success: false,
          message: error
      })
  }
}

async function getProductsFromCart(req,res){
    const{userId}=req.params
   try {
       if(typeof userId == 'undefined'){
        logger.error('Bad Request')
        res.status(400).send({
          success: false,
          message: 'Bad Request'
        })
       }else{
        await Cart.aggregate([
            { $match: { userid:userId,orderStatus: false } },
            { $addFields: { productid: { $toObjectId: '$productid' } } },
            { $sort : { date : -1} },
            {
              $lookup: {
                from: 'productdetails',
                localField: 'productid',
                foreignField: '_id',
                as: 'products'
              }
            },
            { $unwind: '$products' }
          ]).exec((err, docs) => {
            if (err) {
              logger.error('DB Error')
              res.status(502).send({
                success: false,
                message: 'DB Error'
              })
            } else {
              logger.info('Retrived Shopping Cart Details Based on UserId')
              res.status(200).send({
                success: true,
                message: docs
              })
            }
          })
       }
   } catch (error) {
    logger.error(error)
    res.status(500).send({
        success: false,
        message: error
    }) 
   }
}


async function orderItemsFromCart(req,res){
    const{userId,productId,paymentStatus,cartId}=req.body
    try{
        if(typeof userId == 'undefined' || typeof productId == 'undefined'){
            logger.error('Bad Request')
            res.status(400).send({
              success: false,
              message: 'Bad Request'
            })
        }else{
            await Cart.updateMany({_id:cartId,userid:userId,productid:productId},{ $set: { orderStatus: true,date:new Date(),paymentStatus } } ,async (err,docs)=>{
                if(err){
                    logger.error('DB Error')
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else{
                    res.status(200).send({
                        success: true,
                        message: 'Products Ordered Successfully'
                    })
                }
            })
        }
    }catch(error){
        logger.error(error)
        res.status(500).send({
        success: false,
        message: error
    })
    }
}


async function getProductsFromOrdersById(req,res){
    const{userId}=req.params
   try {
       if(typeof userId == 'undefined'){
        logger.error('Bad Request')
        res.status(400).send({
          success: false,
          message: 'Bad Request'
        })
       }else{
        await Cart.aggregate([
            { $match: { userid:userId,orderStatus: true } },
            { $addFields: { productid: { $toObjectId: '$productid' } } },
            { $sort : { date : -1} },
            {
              $lookup: {
                from: 'productdetails',
                localField: 'productid',
                foreignField: '_id',
                as: 'products'
              }
            },
            { $unwind: '$products' }
          ]).exec((err, docs) => {
            if (err) {
              logger.error('DB Error')
              res.status(502).send({
                success: false,
                message: 'DB Error'
              })
            } else {
              logger.info('Retrived Order Details Based On User ID')
              res.status(200).send({
                success: true,
                message: docs
              })
            }
          })
       }
   } catch (error) {
    logger.error(error)
    res.status(500).send({
        success: false,
        message: error
    }) 
   }
}


async function getProductsFromOrders(req,res){
    try {
         await Cart.aggregate([
             { $match: {orderStatus: true } },
             { $addFields: { productid: { $toObjectId: '$productid' } } },
             { $addFields: { userid: { $toObjectId: '$userid' } } },
             { $sort : { date : -1} },
             {
               $lookup: {
                 from: 'productdetails',
                 localField: 'productid',
                 foreignField: '_id',
                 as: 'products'
               }
             },
             {
                $lookup: {
                  from: 'userdetails',
                  localField: 'userid',
                  foreignField: '_id',
                  as: 'users'
                }
              },
             { $unwind: '$products' },
             { $unwind: '$users' }
           ]).exec((err, docs) => {
             if (err) {
               logger.error('DB Error')
               res.status(502).send({
                 success: false,
                 message: 'DB Error'
               })
             } else {
               logger.info('Retrived Order Details For all Users')
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
    addProductToCart,
    getProductsFromCart,
    orderItemsFromCart,
    getProductsFromOrdersById,
    getProductsFromOrders,
}