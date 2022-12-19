const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Driver, validate} = require('../models/driver');
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');

const cloudinary = require("../util/cloudinary");
const upload = require("../util/multer");


//const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.put("/", auth, upload.single("image"), async (req, res) => {
    try {
        
      //let user = await Driver.findOne({_id:req.user._id});
      let user = await Driver.findById(req.user._id)
      if(!user) return res.send('user not found')
      // Delete image from cloudinary
      if(user.cloudinary_id){
        
            await cloudinary.uploader.destroy(user.cloudinary_id);
                // Upload new image to cloudinary
            const result = await cloudinary.uploader.upload(req.body.path);
            const data = {
                // name: req.body.name || user.name,
                profile_img: result.secure_url || user.profile_img,
                cloudinary_id: result.public_id || user.cloudinary_id,
            };
            user = await Driver.findByIdAndUpdate(req.user._id, data, {
                new: true
            });
           return res.send('Image Updated Sucessfully');
      }
      
      if(!req.body.path) return res.send('Please choose an image')

      const result = await cloudinary.uploader.upload(req.body.path);
      const data = {
        // name: req.body.name || user.name,
        profile_img: result.secure_url || user.profile_img,
        cloudinary_id: result.public_id || user.cloudinary_id,
      };
      user = await Driver.findByIdAndUpdate(req.user._id, data, {
        new: true
      });
      res.send('Image added sucessfully');
    } catch (err) {
      console.log(err);
    }
});

module.exports = router;
