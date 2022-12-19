const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const number = require('joi/lib/types/number');
const env=require('dotenv').config()

const dutySchema = new mongoose.Schema({
  
    date: {
      type: Date,
      default:Date.now,
      //  required: true,
    },
    details:[
      {
        vehicleNo: {
          type: String,
          required: true,
        },
        busNo: {
          type: Number,
          required: true,
        },
        busRoute: {
          type: String,
          required: true,
        },
        driverName:{
          // type:mongoose.Schema.Types.ObjectId,
          // ref:'Driver'
          type: String,
          required: true,
        },
        driverPhone:{
            // type:mongoose.Schema.Types.ObjectId,
            // ref:'Driver'
            type: Number,
          required: true,
        },
        busType:{
            type:String,
            required:true,
               enum:['R','SPCB','R & SPCB']
        },
        driverType:{
            type:String,
            enum:['REGULAR','ACTING']
        },
        actingName:{
          type:String,
        },
        actingPhone:{
          type:Number,
        }
      }
    ]
  
});


// dutySchema.methods.generateAuthToken = function() { 
//   const token = jwt.sign({ _id: this._id, }, process.env.SECRET_KEY);
//   return token;
// }

const Duty = mongoose.model('Duty', dutySchema);

function validateDuty(duty) {
  const schema = {
    date:Joi.date().required(),
    details:Joi.array().required()
    //vehicleNo:Joi.string().required(),
  };

  return Joi.validate(duty, schema);
}

function dateValidate(date) {
  const schema = {
    date:Joi.date().required(),
    //details:Joi.array().required()
    //vehicleNo:Joi.string().required(),
  };

  return Joi.validate(date, schema);
}



exports.Duty = Duty; 
exports.validate = validateDuty;
exports.dateValidate = dateValidate;