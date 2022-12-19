const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
var cors = require('cors');
const drivers = require('./routes/drivers');
const admins = require('./routes/admins');
const authAdmins = require('./routes/adminAuth');
const authDrivers = require('./routes/driverAuth');
const driverDuty = require('./routes/driverDuty');
const bus=require('./routes/bus');
const uploadImage=require('./routes/imageUpload')



const express = require('express');
const app = express();
//added test in the path .. for the adminn error
const URI='mongodb://sathish:sathish@ac-gnwfaxo-shard-00-00.yvmbmvp.mongodb.net:27017,ac-gnwfaxo-shard-00-01.yvmbmvp.mongodb.net:27017,ac-gnwfaxo-shard-00-02.yvmbmvp.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8jgvsx-shard-0&authSource=admin&retryWrites=true&w=majority'
const URI1='mongodb://localhost/vidly'
mongoose.connect(URI)

  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

  

app.use(express.json());
app.use(cors());
app.use('/api/drivers', drivers);
app.use('/api/auth/driver', authDrivers);


app.use('/api/admins', admins); // create admin user
app.use('/api/auth/admin', authAdmins); // login admin user

//driver daily duty
app.use('/api/driver/duty', driverDuty);


//bus details
app.use('/api/bus', bus);

//driver upload
app.use('/api/uploadImage', uploadImage);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));