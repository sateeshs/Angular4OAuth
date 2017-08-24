const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());

let database;
//console.log(process.env.DB_CONN);

//app.route('api/contacts');

app.get('/api/contacts', (req, res) => {
    console.log('http Get...');
    const contactsCollection = database.collection('contacts');

    contactsCollection.find({}).toArray((err, doc) => {
        return res.json(doc);
    });
});

app.post('/api/contacts', (req, res) => {
    const user = req.body;
    console.log(user);
    const contactCollection = database.collection('contacts');
    contactCollection.insertOne(user, (err, r) => {
        if (err) {
            return res.status(500).json({ error: 'Error while inserting new user' });
        }

        const newRecord = r.ops[0];

        return res.status(201).json(newRecord);
    });
});


app.on('start', function () {
    console.log('Application ready to serve requests.');
    //console.log('Environment: %s', app.kraken.get('env:env'));
});
app.use(function (req, res, next) {
    res.status(404).send('404 page');
});


MongoClient.connect(process.env.DB_CONN, (err, db) => {
    console.log('Connected to MongoDb..');
    if (err) {
        return console.dir(err);}
    app.listen(3000, () => {
        database = db;
        console.log('listening on port 3000');
    });
   
});
