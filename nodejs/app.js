const express = require('express');
// middleware which convert request body to json
const bodyParser = require('body-parser');
// middleware which convert the incoming json to valid graphql query
const graphqlHttp = require('express-graphql');

const app = express();

// parse the request body which was sent from frontend
app.use(bodyParser.json());

// a basic route
app.get('/', (req, res, next) => {
    res.send('hello asd'); 
})

// start/listen server to a port
app.listen(3000);

