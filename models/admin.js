const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const env=require('dotenv').config()

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  designation:{
    type: String,
    required: true,
    maxlength: 1024
  },
  isAdmin:{
    type:Boolean,
    default:true
  }
});


adminSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.SECRET_KEY);
  return token;
}

const Admin = mongoose.model('Admin', adminSchema);

function validateAdmin(admin) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    designation:Joi.string().max(255).required(),
  };

  return Joi.validate(admin, schema);
}

exports.Admin = Admin; 
exports.validate = validateAdmin;