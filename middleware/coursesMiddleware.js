const {body} = require('express-validator');
const { title } = require('node:process');

middlewareHandler = [
        body('price').notEmpty().withMessage('Course price is required!'),
        body('title').notEmpty().withMessage('Course title is required!'),
        //body('couresCode').notEmpty().withMessage('Course code is required!!')
    ]

module.exports = {middlewareHandler};