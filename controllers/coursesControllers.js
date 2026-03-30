// const { error } = require('node:console');
const Course = require('../models/courseModel');
const {validationResult, body} = require('express-validator');
const utilsFileSataus = require('../utils/utils');
const appError = require('../utils/appError');
const asyncWrapper = require('../middleware/asyncWrapper');
const error = new Error();

const getHomePage = (req , res) => {
    res.send('Welcome to home page...');
}

const getAllCourses = asyncWrapper(
    async (req , res) => {
        const query = req.query;
        const limit = query.limit || 4;// (4) is the default value
        const page = query.page || 1;// (1) is the default value
        const skip = (page - 1) * limit;
        // Get all courses from database using course model
        const courses = await Course.find({} , {
            // Get all courses without "__v" field
            "__v": false,
        }).limit(limit).skip(skip);
        res.json({status:utilsFileSataus.SUCCESS , data:{courses}});
    }
)

const getSingleCourse = asyncWrapper(
    async (req , res , next) => {
        const course = await Course.findById(req.params.couresCode , {
            "__v": false,
        });
        if(course){
            return res.json({status:utilsFileSataus.SUCCESS , data:{course}});
        } else{
            const error = appError.create('Not found!!' , 404 , utilsFileSataus.ERROR);
            return next(error);
            }
    }
)

const postCourse = asyncWrapper(
    async (req , res , next ) => {// Send data from client to server
        const result = validationResult(req);
        if(!result.isEmpty()){
            const error = appError.create(result.array() , 400 , utilsFileSataus.FAIL);
            return next(error);
        } else{
            const newCourse = new Course(req.body);
            await newCourse.save();
            res.status(201).json({status:utilsFileSataus.SUCCESS , data:{newCourse}});
        }
    }
)

const updateCourse = asyncWrapper(
    async (req , res , next) => {
        const courseData = await Course.findById(req.params.couresCode);
        const result = validationResult(req);
        if(!result.isEmpty()){
            const error = appError.create(result.array() , 400 , utilsFileSataus.FAIL);
            return next(error);
        } else if(req.body.price === courseData.price && req.body.title === courseData.title){
            const error = appError.create("Same DATA!!" , 400 , utilsFileSataus.FAIL);
            return next(error);
        } else{
            await Course.findByIdAndUpdate(req.params.couresCode , {$set: {...req.body}});
            const courseData = await Course.findById(req.params.couresCode);
            return res.status(200).json({status:utilsFileSataus.SUCCESS , data:{courseData}});
        }
    }
)    

const deleteCourse = asyncWrapper(
    async (req , res , next) => {
        const resMessage = await Course.deleteOne({_id: req.params.couresCode});
        if(resMessage.deletedCount){
            res.status(201).json({status:utilsFileSataus.SUCCESS , data:null});
        } else{
            return next(appError.create('Course not found!!' , 400 , utilsFileSataus.ERROR));
        }
    }
)

module.exports = {
    getHomePage,
    getAllCourses,
    getSingleCourse,
    postCourse,
    updateCourse,
    deleteCourse
}