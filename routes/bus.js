//const auth = require('../middleware/auth');
const {Bus, validateBus} = require('../models/bus');

const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

//to get details of an single bus
router.post('/details',[auth,admin], async (req, res) => {
  
  const { error } = validateBus(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const list = await Bus.find({busNumber:req.body.busNumber}).count();
  
  try {
    if(list<1){
      res.send('No bus found') // no duty in the given date
    }else{
      const list = await Bus.find({busNumber:req.body.busNumber})
      res.send(list);
    } 
    
  } catch (error) {
    console.log(error);
  }
});

// to get all bus details 
router.get('/list',[auth,admin], async (req, res) => {
  
    // const { error } = validateBus(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);
    
  try {
      const list = await Bus.find({})
      res.status(200).send(list);
  } catch (error) {
      console.log(error);
  }
  
});

// create a new bus with details
router.post('/create',[auth,admin], async (req, res) => {
  const { error } = validateBus(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
 
  // const list = await Duty.find({date:{$gt:'2022-12-20',$lt:'2022-12-22'}});
  try {
    let bus = await Bus.findOne({busNumber: req.body.busNumber});
    if (bus) return res.status(400).send('Already created for this busNumber.');
    
    let no = await Bus.findOne({routeNumber: req.body.routeNumber});
    if (no) return res.status(400).send('Already created for this route number.');
       const duty = new Bus({
        busNumber:req.body.busNumber,
        routeNumber:req.body.routeNumber,
        route:req.body.route,
        stops:req.body.stops,
        firstUsage:req.body.firstUsage
      });
      await duty.save();
      res.send("Bus created Sucessfully")
    
  } catch (error) {
    console.log(error);    
  }

   
});

module.exports = router; 
