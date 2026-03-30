const mongoose = require('mongoose');
const { type } = require('node:os');
const validator = require('validator')
const userRoles = require('../utils/userRules');

const usersSchema = new mongoose.Schema({
  firstName: {
        type: String,
        required: true
  },
  lastName: {
        type: String,
        required: true
  },
  email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail , 'Field must be a valid email address']
  },
  password: {
        type: String,
        required: [true , 'Password is required!!']
  },
  rule: {
        type: String,
        required: true,
        enum: [userRoles.ADMIN , userRoles.MANAGER , userRoles.USER]
  },
  token: {
        type: String,
  },
  avatar: {
        type: String,
        default: 'uploads/defProfilePic.png',
  }
});

module.exports = mongoose.model('User', usersSchema);