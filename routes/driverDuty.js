const auth = require('../middleware/auth');
const admin=require('../middleware/admin');
const {Duty, validate,dateValidate} = require('../models/driverDuty');
const mongoose = require('mongoose');
const express = require('express');
const { Bus } = require('../models/bus');
const { Driver } = require('../models/driver');
const router = express.Router();


router.get('/',[auth,admin], async (req, res) => {
  
  const buses = await Bus.find()
  const drivers=await Driver.find().select('-password')
  
  res.status(200).send({buses,drivers}) 

});


router.post('/dutyList',[auth,admin], async (req, res) => {
  // const list = await Duty.find({date:{$gt:'2022-12-20',$lt:'2022-12-22'}});
  
  // if no date or invalid format
  const { error } = dateValidate(req.body); 
  if (error) return res.status(400).send('enter date in YYYY-MM-DD format');
  
  const list = await Duty.find({date:req.body.date}).count();
  
  if(list<1){
    res.send('No duty list found') // no duty in the given date
  }else{
    const list = await Duty.find({date:req.body.date})
    res.send(list);
  } 

});

router.post('/create',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // const list = await Duty.find({date:{$gt:'2022-12-20',$lt:'2022-12-22'}});
  let list = await Duty.findOne({ date: req.body.date});
  if (list) return res.status(400).send('Duty already alloted for this date.');

  const d = new Date();   // Comparing the current date with the requsted date

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 
  const fDate=formatDate(d);


  if(req.body.date < fDate){
    return res.status(400).send('cannot allot duty for a completed date.');
  }else{
     const duty = new Duty({
      date:req.body.date.toString(),
      details:req.body.details
    });
    await duty.save();
    res.send("Duty created Sucessfully")
  } 
});

// Update the whole document as a Replaced document 

router.put('/update',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // const list = await Duty.find({date:{$gt:'2022-12-20',$lt:'2022-12-22'}});
  let list = await Duty.findOne({ date: req.body.date});
  if (list){
    
    const d = new Date();   // Comparing the current date with the requsted date
    
    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        
        if (month.length < 2) 
        month = '0' + month;
        if (day.length < 2) 
        day = '0' + day;
        
        return [year, month, day].join('-');
    }
      
      const fDate=formatDate(d);
      
      
      if(req.body.date < fDate){
        return res.status(400).send('cannot update duty for a completed date.');
      }else{
        Duty.replaceOne({date:req.body.date}, {date:req.body.date,details:req.body.details},null, function (err, docs) {
          if (err){
            console.log(err)
          }
          else{
            res.status(200).send("Updated Sucessfully")
          }
        });
      } 
  }
});


module.exports = router; 
