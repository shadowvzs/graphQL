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
app.use('/graphql', graphqlHttp({
    // buildSchema takes string and build javascript schema object from it
    // we use backticket for multiline purpose
    // type, schema is required

    // events are array if string array then must put [String}
    // if [String!] is like important
    // if  [String!]! cannot be empty

    // if createEvent(name: String): String 
    // then in createEvent function must enter a string and return a string
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['item 1', 'item 2', 'item 3'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

// start/listen server to a port
app.listen(3000);


/**
 * Note: 
 * - Schema could ne:
 *    - query is the Get like request where we need data
 *    - mutation is the post/put/patch/delete like request where we must change data
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