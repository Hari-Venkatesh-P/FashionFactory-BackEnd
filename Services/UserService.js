const User  = require('../Models/User')

const logger = require('../Library/logger')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function addUser(req,res){
    await User.findOne( {mobile:req.body.mobile}, async function (err,usermobiledocs){
    if(err){
        logger.error(err)
        res.status(502).send({
            success: false,
            message: 'DB Error'
        })
    }else if(usermobiledocs!==null){
        logger.error('Mobile Phone already exists')
        res.status(201).send({
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
                    password:req.body.password,
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

async function loginUser(req,res)
{
    try{
        await User.findOne({email:req.body.email}, (findError, docs) => {
            if (!docs) {
                logger.warn("Email Id does not exists")
                res.status(201).json({
                    success: false,
                    message: 'Email Id does not exists'
                })
            }else if(findError){
                logger.error(err)
                res.status(502).send({
                    success: false,
                    message: 'DB Error'
                })
            }else {
                bcrypt.compare(req.body.password, docs.password, function (err, result) {
                    if(err){
                        logger.warn('Error during Password Comparion')
                        res.status(201).send({
                            success: false,
                            message: 'Error during Password Comparion'
                        })
                    }else if(result==true){
                        jwt.sign({docs}, 'secretkey', (err, token) => {
                            if(err){
                                logger.warn('Error during Token  Generation')
                                res.status(201).send({
                                    success: false,
                                    message: 'Error during Token  Genration'
                                })
                            }else{
                                logger.info('User Loggen in successfully')
                                res.status(200).json({
                                    success:true,
                                    id:docs._id,
                                    message: "Logged in as "+docs.name+".",
                                    role:docs.role,
                                    jwttoken : token
                                });
                            }
                        });
                     }else if(result==false){
                        logger.warn('Password Mismatch')
                            res.status(201).json({
                                success:false,
                                message: "Password Mismatch",
                            });
                     }else{
                        logger.warn('Invalid Credentials')
                            res.status(201).json({
                                success:false,
                                message: "Invalid Credentials",
                            });
                     }   
                    });
                }
            })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server Problem'
        })
    }
}


async function updateUser(req,res){
    const{mobile,address,id}=req.body
    try{
        if(typeof mobile == 'undefined' || typeof address == 'undefined' ||  typeof id == 'undefined'){
            logger.error('Bad Request')
            res.status(400).send({
              success: false,
              message: 'Bad Request'
            })
        }else{
            await User.findOne( {mobile:req.body.mobile}, async function (err,usermobiledocs){
                if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else if(usermobiledocs!==null){
                    logger.error('Mobile Phone already exists')
                    res.status(201).send({
                        success: false,
                        message: 'Mobile Phone already exists'
                    })
                }else{
                    await User.updateOne({_id:id},{ $set: { address: address,mobile:mobile } } ,async (err,docs)=>{
                        if(err){
                            logger.error('DB Error')
                            res.status(502).send({
                                success: false,
                                message: 'DB Error'
                            })
                        }else{
                            logger.info('User Details Edited Successfully')
                            res.status(200).send({
                                success: true,
                                message: 'User Details Edited Successfully'
                            })
                        }
                    })
                }
            });
        }
    }catch(error){
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
    loginUser,
    updateUser,
}