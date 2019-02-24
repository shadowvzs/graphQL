const express = require('express');
// middleware which convert request body to json
const bodyParser = require('body-parser');
// middleware which convert the incoming json to valid graphql query
const graphqlHttp = require('express-graphql');

// we need mongoose package for connect to mongodb
const mongoose = require('mongoose');
// import the built scheman
const graphQlSchema = require('./graphql/schema');
// import the root resolver
const graphQlResolvers = require('./graphql/resolvers');
// auth middleware
const isAuth = require('./middleware/is-auth');

const app = express();

// parse the request body which was sent from frontend
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// added isAuth middleware which only check if request have token/correct token in request 
// we will make verification in resolver function because we can get there request object too
app.use(isAuth);

// graphql endpoint where graphql middleware will proccess the json to query
// we must pass an object where we declare:
// - scheme we create with graphql package
// - rootValue is resolver function which must match with schema enpoint names

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    // graphiql: true      -this only for development mode, its great help because we can use browser for debug
}));

/**
 * Note:
 * - Type:
 *    - we have rootTypes which contain an array of events
 *         - can be empty array but if have value in array then must be events
 *         - ex.: events: [Event!]! - Event is custom event name (! used because required/important to have)
 *    - we have custom events:
 *         - ex. like above with _id: ID!
 * - Schema could be:
 *    - query is the Get like request where we need data
 *           - param could be typed names or another custom input type
 *                 - createEvent(title: String!, price: Float!): Event
 *                 - createEvent(myEventInput: EventInput): Event
 *                      - name convention: must start with event name like EventInput if event name is Event
 *                      - we also give custom argument name and then type must be our type input
 *           - return an array of events
 *    - mutation is the post/put/patch/delete like request where we must change data
 *           - return an event
 *    - Subscription is websocket like requests
 *
 *    - Schema is type depend so we cant declare types
 *
 * - RootValue/Resolver is the resolver and must have exactly same names
 *                          like what we used in schema
 *    - mutation function have args like argument list and property
 *       must match with name and type in scheme
 *
 * - graphiql/Debugger - optional
 */

// we connect to mongo db with info which we get from enviroment variables
// how to connect to MongoDB Atlas Cloud Cluster
/*

console.log(process.env.MONGO_USER,process.env.MONGO_PASSWORD);

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
  }@cluster0-euqqc.mongodb.net/myDB?retryWrites=true`)
  .then( () => {
      // if we can connect to mongodb then we start express http server
      app.listen(3000); 
  }).catch(err => {
      // we cannot connect to mongodb
      console.log(err);
  });
*/


// we connect to local mongo db with host and password (ex. if mongodb is another container)
const mongoOptions = { useNewUrlParser: true };
const {MONGO_HOST, MONGO_PORT, MONGO_DB} = process.env;
console.log(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);
mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, mongoOptions)
    .then(() => {
        // if we can connect to mongodb then we start express http server
        console.log('Server is running!');
        app.listen(8000);
    })
    .catch( err => console.log(err) );

// for api test we can use postman when we have token and we need use headers because grpahql not let declar the header
// https://www.getpostman.com/downloads/
// must add Authorization to header
// Bearer *token*
// need choose raw/json
// { "query": "query { login(email: \"test@test.com\", password: \"111111\") {token} }" }
// { "query": "mutation { createEvent(myEventInput: {title: \"should work\", description:\"test description\", price: 21.22, date:\"2018-02-01T12:11:33.077Z\"}) {_id title} }" }