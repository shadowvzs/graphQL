const express = require('express');
// middleware which convert request body to json
const bodyParser = require('body-parser');
// middleware which convert the incoming json to valid graphql query
const graphqlHttp = require('express-graphql');
// buildSchema help to build a js object literal
const { buildSchema } = require('graphql');

const app = express();

// temporary data for demonstration
const events = [];

// parse the request body which was sent from frontend
app.use(bodyParser.json());

// graphql endpoint where graphql middleware will proccess the json to query
// we must pass an object where we declare:
// - scheme we create with graphql package
// - rootValue is resolver function which must match with schema enpoint names
app.use('/graphql', graphqlHttp({
    // buildSchema takes string and build javascript schema object from it
    // we use backticket for multiline purpose
    // type, schema is required

    // events are array if string array then must put [String}
    // if [String!] is like important
    // if  [String!]! cannot be empty

    // if createEvent(name: String): String
    // then in createEvent function must enter a string and return a string

    // Event is custom type here which could have any name :)
    // in types we have name: type pairs
    // id must have ID type with !
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(myEventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.myEventInput.title,
                description: args.myEventInput.description,
                price: +args.myEventInput.price,
                date: args.myEventInput.date
            };
            console.log(args, event);
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

// start/listen server to a port
app.listen(3000);


/**
 * Note:
 * - Type:
 *    - we have rootTypes which contain an array of events
           - can be empty array but if have value in array then must be events
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

/**
* How to test?
* Browser: 127.0.0.1:3000/graphql
* query {
*    events {
*      title
*      price
*   }
* }
*
* mutation {
*   createEvent(myEventInput: {title: "a title", description: "test description", price: 12.3, date: "2019-02-04T06:45:46.489Z"}) {
*     title
*     description
*   }
* }
* // in createEvent(args) we can access like: title: args.myEventInput.title,
*
*/
