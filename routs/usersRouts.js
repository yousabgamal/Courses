const usersController = require('../controllers/usersControllers');
const express = require('express');
const router = express.Router();
const verification = require('../middleware/verifyToken');
const multer  = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
        destination: function (req, file, callBack) {
                console.log("File..." , file);
                callBack(null, 'uploads');
        },
        filename: function (req, file, callBack) {// You can edit your file name
                const ext = file.mimetype.split('/')[1];
                const fileName = `user-${Date.now()}.${ext}`;
                callBack(null, fileName);
        } 
});
const fileFilter = (req , file , callBack) => {
        const fileType = file.mimetype.split('/')[0];
        if(fileType === 'image'){
                return callBack(null , true);
        } else{
                return callBack(appError.create('The file must be an image' , 400) , false);
        }
};
const upload = multer({ 
        storage: diskStorage , 
        fileFilter});

// Get all users
router.route('/')
        .get(verification , usersController.getAllUsers);

// Register
router.route('/register')
        .post( upload.single('profilePic') , usersController.register);

// Login
router.route('/login')
        .post(usersController.login);        

module.exports = router;