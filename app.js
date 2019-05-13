var express = require('express')
var app = express()

var userRoutes = require('./route/user');
var taskRoutes = require('./route/task');
var commentRoutes = require('./route/comment')
var projectRoutes = require('./route/project')
var moduleRoutes = require('./route/module')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use('/user',userRoutes);
app.use('/task',taskRoutes);
app.use('/comment',commentRoutes);
app.use('/project',projectRoutes);
app.use('/module',moduleRoutes);
// import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/taskify', {useNewUrlParser: true});
console.log("app ends");
app.listen(3000)