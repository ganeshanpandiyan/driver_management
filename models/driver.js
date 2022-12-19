const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');


const env=require('dotenv').config()

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  profile_img: String,
  cloudinary_id: String
});


driverSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, }, process.env.SECRET_KEY);
  return token;
}

const Driver = mongoose.model('Driver', driverSchema);

function validateDriver(driver) {
  const schema = {
    name:Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(10).max(10).required(),
    password: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(driver, schema);
}

exports.Driver = Driver; 
exports.validate = validateDriver;