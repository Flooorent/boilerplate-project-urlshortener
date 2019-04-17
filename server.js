'use strict';

const app = require('./app')
const {client: MongoClient} = require('./config/mongo')

// Basic Configuration 
var port = process.env.PORT || 3000;

MongoClient.connect(function(err) {
  if(err) {
    throw new Error(err)
  }

  console.log('Connected to mongo')
  app.emit('ready')
})