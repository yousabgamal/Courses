const appError = require("../utils/appError");
const utilsFileStatus = require('../utils/utils');

module.exports = (...roles) => {// You will receive an array of arguments
    return (req , res , next) => {
        if(!roles.includes(req.currentUser.rule)){
            return next(appError.create('This role is not authorized!!' , 401 , utilsFileStatus.FAIL));
        } else{
            next();
        }
    }
}