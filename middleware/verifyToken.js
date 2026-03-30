const jwt = require('jsonwebtoken');
const utilsFileStatus = require('../utils/utils');
const appError = require('../utils/appError');

const verifyToken = (req , res , next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = appError.create('Token is required!!' , 401 , utilsFileStatus.ERROR);
        return next(error);
    } else{
        const token = authHeader.split(" ")[1];// 1(index) , " "(to split after the space)
        try{
            const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
            req.currentUser = decodedToken;
            next();
        } catch(err){
            const error = appError.create('Invalid token!!' , 401 , utilsFileStatus.ERROR);
            return next(error);
        }
    }
}

module.exports = verifyToken;