const mongoose = require('mongoose');
const { type } = require('node:os');

const courseSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true
  },
  price: {
        type: Number,
        required: true
  }
});
// This model used to interact with database using CRUD operations
module.exports = mongoose.model('Course', courseSchema);// Course(is the collection name in the database but it will be modified to courses by the model)
