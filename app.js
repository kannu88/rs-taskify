var express = require('express')
var app = express()
var jwt = require('jsonwebtoken');
var cors = require('cors');

var userRoutes = require('./route/user');
var taskRoutes = require('./route/task');
var commentRoutes = require('./route/comment')
var projectRoutes = require('./route/project')
var moduleRoutes = require('./route/module')
var learnRoutes = require('./route/learn')
var clientRoutes = require('./route/client')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var config = require('./model/config'); // get our config file
app.use(bodyParser.urlencoded({extended:true}));
app.use('/learn',learnRoutes);
app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));
app.use(bodyParser.json());
app.set('superSecret', config.secret);

app.use('/user',userRoutes);
app.use(express.static('public'));

app.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['authorization'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token,config.secret, function(err, decoded) {       
          if (err) {
          return res.json({ 
              success: false, 
              message: 'Failed to authenticate token.' 
            });       
        } 
        else 
        {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;         next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
  
    }
  });
 
app.use('/task',taskRoutes);
app.use('/client',clientRoutes);
app.use('/comment',commentRoutes);
app.use('/project',projectRoutes);
app.use('/module',moduleRoutes);
// import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/taskify', {useNewUrlParser: true});
console.log("app ends");
app.listen(3000)