const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/users');
const appError = require('../utils/appError');
const utilsFileStatus = require('../utils/utils');
const bcrypt = require('bcryptjs');
const gjwt = require('../utils/generateJWT');

const getAllUsers = asyncWrapper(
    async (req , res) => {
        const query = req.query;
        const limit = query.limit || 4;// (4) is the default value
        const page = query.page || 1;// (1) is the default value
        const skip = (page - 1) * limit;
        // Get all users from database using course model
        const users = await User.find({} , {
            // Get all users without "__v" field
            "__v": false,
            "password": false
        }).limit(limit).skip(skip);
        res.json({status:utilsFileStatus.SUCCESS , data:{users}});
    }
)

const register = asyncWrapper(
    async (req , res , next) => {
        const {firstName ,  lastName , email , password , rule} = req.body;
        const oldUser = await User.findOne({email: email});
        if(oldUser){
            const error = appError.create('User with this email already exists!!' , 400 , utilsFileStatus.FAIL);
            return next(error);
        } else{
            if(!password){
                const error = appError.create('Password is required!!' , 400 , utilsFileStatus.FAIL);
                return next(error);
            } else{
                const hashedPass = await bcrypt.hash(password , 10);// 10(Number of string concatenated with the pass)
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password : hashedPass,
                    rule,
                    avatar : req.file.filename
                });
                // Generate JWT 
                const token = await gjwt({email:newUser.email , id:newUser._id , rule:newUser.rule});
                newUser.token = token;
                await newUser.save();
                res.status(201).json({status:utilsFileStatus.SUCCESS , data:{user: newUser}});
            }
        }
    }
)

const login = asyncWrapper(
    async (req , res , next) => {
        const {email , password} = req.body;
        if(!email || !password){
            const error = appError.create('Both email and password are required!!' , 500 , utilsFileStatus.FAIL);
            return next(error);
        } else{
            const user = await User.findOne({email});
            if(!user){
                const error = appError.create('User not found!!' , 400 , utilsFileStatus.FAIL);
                return next(error);
            } else{
                const isPassMatch = await bcrypt.compare(password , user.password);
                if(!isPassMatch){
                    const error = appError.create('Wrong password!!' , 400 , utilsFileStatus.FAIL);
                    return next(error);
                } else{
                    const token = await gjwt({email:user.email , id:user._id , rule:user.rule});
                    res.status(200).json({status:utilsFileStatus.SUCCESS , token:token});
                }
            }
        }
    }
)

module.exports = {
    getAllUsers,
    register,
    login
}