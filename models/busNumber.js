const Joi = require('joi');
const mongoose = require('mongoose');

const busNumberSchema = new mongoose.Schema({
  
    busNumber: {
      type: Number,
      required: true,
    },
});

const Busnumber = mongoose.model('Busnumber', busNumberSchema);

function validateNumber(num) {
  const schema = {
    busNumber:Joi.number().required(),
    
  };

  return Joi.validate(num, schema);
}


exports.Busnumber = Busnumber; 
exports.validateNumber = validateNumber;
