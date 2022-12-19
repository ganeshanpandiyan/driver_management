const auth = require('../middleware/auth');
const admin=require('../middleware/admin');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Admin, validate} = require('../models/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// router.get('/me', auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password');
//   res.send(user);
// });

router.post('/create',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Admin.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new Admin(_.pick(req.body, ['name', 'email', 'password','designation']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send("Admin created Sucessfully")

  // const token = user.generateAuthToken();
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


router.put('/changePassword', auth, async (req, res) => {
  if(req.body.oldPassword !=='' || req.body.newPassword !=='' || req.body.confirmPassword !==''){
    // console.log('in bcrypt');
    // console.log(req.body);
    
    const user = await Admin.findById(req.user._id)//.select('-password');
    // console.log(user);
    const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!validPassword){ 
      return res.status(400).send('Invalid passwords.')}
    else{
      if(req.body.newPassword!==req.body.confirmPassword) return res.status(400).send('Enterered new passwords are not same')
      // console.log(req.body.newPassword);
      // // const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password=newPassword;
      const result=await user.save();
      
      if(result) res.status(200).send('Updated Sucessfully')
      
    }
    
  }
  else{
    res.status(400).send('Fill out all the values')
  }
  
  
  
  // if(user)
  // res.send(user);

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   const course=await Course.findByIdAndUpdate(id,{
//     $set:{
//         author:"pandiyan",
//         price:10
//     }
// }


});



module.exports = router; 
