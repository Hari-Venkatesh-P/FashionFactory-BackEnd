const Cart = require('../Models/Cart')
const Product  = require('../Models/Product')

const logger = require('../Library/logger')

async function addProductToCart(){
    try{
        const {userId,productId} = req.body
        await Product.findOne({_id:productId,availableQuantity: { $gt:0}},async function(err,productdocs){
            if(err){

            }else if(productdocs===null){

            }else{
                
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


module.exports = {
    addProductToCart,
}