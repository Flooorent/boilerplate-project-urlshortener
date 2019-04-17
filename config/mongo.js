const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://127.0.0.1'
const dbName = 'fcc-urlshortener'
const collection = 'urls'

const client = new MongoClient(url)

module.exports = {
    client,
    dbName,
    collection,
}
