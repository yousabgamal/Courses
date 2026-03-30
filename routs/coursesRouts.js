const controllers = require('../controllers/coursesControllers');
const {middlewareHandler} = require('../middleware/coursesMiddleware');
const express = require('express');
const router = express.Router();
const verification = require('../middleware/verifyToken');
const userRoles = require('../utils/userRules');
const allowedTo = require('../middleware/allowedTo');

// CRUD(Create,Read,Update,Delete) operations...
router.get('/home' , controllers.getHomePage);

// .route -> Handle many routs with the same path 
router.route('/')
    .get(controllers.getAllCourses)
    .post(verification , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , middlewareHandler , controllers.postCourse);

router.route('/:couresCode')
    .get(controllers.getSingleCourse)
    .patch(verification , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , middlewareHandler , controllers.updateCourse)
    .delete(verification , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , controllers.deleteCourse);

module.exports = router;