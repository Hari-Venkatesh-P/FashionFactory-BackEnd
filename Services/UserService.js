const User  = require('../Models/User')

const logger = require('../Library/logger')



async function addUser(req,res){
    await User.findOne( {mobile:req.body.mobile}, async function (err,usermobiledocs){
        console.log(usermobiledocs)
    if(err){
        logger.error(err)
        res.status(502).send({
            success: false,
            message: 'DB Error'
        })
    }else if(usermobiledocs!==null){
        logger.error('Mobile Phone already exists')
        res.status(502).send({
            success: false,
            message: 'Mobile Phone already exists'
        })
    }else{
        await User.findOne({email:req.body.email}, async function (err,useremaildocs){
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(useremaildocs!==null){
                logger.error('Email already exists')
                res.status(502).send({
                    success: false,
                    message: 'Email  already exists'
                })
            }else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    address:req.body.address,
                    mobile:parseInt(req.body.mobile),
                    password:req.body.name,
                })
                newUser.save((err,docs)=>{
                    if(err){
                        logger.error(err)
                        res.status(502).send({
                            success: false,
                            message: 'DB Error'
                        })
                    }else{
                        logger.info('User Saved Successfuly')
                        res.status(200).send({
                            success: true,
                            message: 'User Saved Successfuly'
                        })
                    }
                })
            }
        })
    }
    });
}

async function getAllUsers (req, res) {
    try {
        await User.find({},async (err,alluserdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(alluserdocs.length===0){
                logger.warn("No Users found")
                res.status(403).send({
                    success: false,
                    message: 'No Users found'
                })
            }else{
                logger.info('All Users fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: alluserdocs
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

  async function getUserById (req, res) {
    try {
        await User.findOne({_id:req.params.id},async (err,userdocs)=>{
            if(err){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else if(userdocs===null){
                logger.warn("No User found")
                res.status(403).send({
                    success: false,
                    message: 'No User found'
                })
            }else{
                logger.info('User fetched successfulyy')
                res.status(200).send({
                    success: true,
                    message: userdocs
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
    addUser,
    getAllUsers,
    getUserById,
}