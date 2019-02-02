const express = require('express');
// middleware which convert request body to json
const bodyParser = require('body-parser');
// middleware which convert the incoming json to valid graphql query
const graphqlHttp = require('express-graphql');
// buildSchema help to build a js object literal
const { buildSchema } = require('graphql');

const app = express();

// parse the request body which was sent from frontend
app.use(bodyParser.json());

// graphql endpoint where graphql middleware will proccess the json to query
// we must pass an object where we declare:
// - scheme we create with graphql package
// - rootValue is resolver function which must match with schema enpoint names
app.get('/graphql', graphqlHttp({
    // buildSchema takes string and build javascript schema object from it
    // we use backticket for multiline purpose
    schema: buildSchema(`
        schema {
            query:
            mutation: 
        }
    `),
    rootValue: {}
}));

// start/listen server to a port
app.listen(3000);


/**
 * Note: 
 * In schema the:
 *    - query is the Get like request where we need data
 *    - mutation is the post/put/patch/delete like request where we must change data
 *    -  is websocket like requests 
 * 
 * 
 */