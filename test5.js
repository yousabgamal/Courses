require('dotenv').config();
const express = require('express');
const courseMiniApp = require('./routs/coursesRouts');
const usersMiniApp = require('./routs/usersRouts')
const mongoose = require('mongoose');
const utilsFileSataus = require('./utils/utils');
const cors = require('cors');
const path = require('path');

const app = express();

const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
    console.log('Mongodb server started.');
});

app.use(cors())
app.use(express.json());// Parsing data posted from the client
// This middleware handles any static file(pic , audio , vedio...)
app.use('/uploads' , express.static(path.join(__dirname , 'uploads')));
app.use('/api/courses' , courseMiniApp);// Any request with '/api/courses' deals with courseMiniApp file
app.use('/api/users' , usersMiniApp);// Any request with '/api/users' deals with usersMiniApp file
app.all('{*splat}', (req, res) => {
    // This middleware will execute if any other route not handled in courseMiniApp 
    return res.status(404).json({status: utilsFileSataus.ERROR, message:'This resource is not available'});
});
// Global error handler
app.use((error , req , res , next) => {
    res.status(error.statusCode || 500).json({status:error.errorStatus || utilsFileSataus.ERROR , message:error.message});
});

app.listen(process.env.PORT , () => {
    console.log('Listening to port' , process.env.PORT);
});