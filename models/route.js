const Joi = require('joi');
const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  
    route: {
      type: String,
      required: true,
    },
    stops:{
      type:Array
    }
 
});

const Route = mongoose.model('Route', busRouteSchema);

function validateRoute(route) {
  const schema = {
    route:Joi.string().required(),
    stops:Joi.array()
  };

  return Joi.validate(route, schema);
}


exports.Route = Route; 
exports.validate = validateRoute;
