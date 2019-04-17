const dns = require('dns')
const urlModule = require('url')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongo = require('mongodb')

const {client: mongoClient, dbName, collection: mongoCollection} = require('./config/mongo')

const app = express();

const port = process.env.PORT || 3000;


/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.post('/api/shorturl/new', function(req, res) {
    const url = req.body.url

    if(!url) {
        return res.json({ error: "invalid URL" })
    }

    const parsedUrl = urlModule.parse(url)
    const host = parsedUrl.host
    console.log(host)

    dns.lookup(host, function(err, address) {
      if(!address) {
        return res.json({error: "invalid URL"})
      }

      const db = mongoClient.db(dbName)
      const collection = db.collection(mongoCollection)
  
      collection.insertOne({original_url: url}, function(err, result) {
        if(err) {
          return next(err)
        }
  
        const {original_url, _id} = result.ops[0]
  
        return res.json({original_url, short_url: _id})
      })
    })
})

app.get('/api/shorturl/:short_url', function(req, res) {
  const db = mongoClient.db(dbName)
  const collection = db.collection(mongoCollection)

  collection.findOne({_id: mongo.ObjectID(req.params.short_url)}, function(err, result) {
    if(err) {
      return next(err)
    }

    if(result) {
      return res.redirect(result.original_url)
    }

    return res.json({error: 'invalid URL'})
  })
})

app.on('ready', function() {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  })
})

module.exports = app;
