const Joi = require('joi');
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber:{
        type:String,
        required:true,
        // unique:true
    },
    route: {
      type: String,
      //required: true,
      default:'Not Assigned'
    },
    stops:{
      type:Array
    },
    routeNumber:{
        type:String,
        default:'Not Assigned'
        // required: true,
        // unique:true
    },
    firstUsage:{
        type: Date,
        default:Date.now,  
    }
 
});

const Bus = mongoose.model('Bus', busSchema);

function validateBus(bus) {
  const schema = {
    busNumber:Joi.string().required(),
    route:Joi.string(),
    stops:Joi.array(),
    routeNumber:Joi.string(),
    firstUsage:Joi.date().iso()
  };

  return Joi.validate(bus, schema);
}


exports.Bus = Bus; 
exports.validateBus = validateBus;
