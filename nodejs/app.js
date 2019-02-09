const express = require('express');
// middleware which convert request body to json
const bodyParser = require('body-parser');
// middleware which convert the incoming json to valid graphql query
const graphqlHttp = require('express-graphql');
// we encrypt password and for this we use bcryptjs module
const bcrypt = require('bcryptjs');
// buildSchema help to build a js object literal
const { buildSchema } = require('graphql');
// we need mongoose package for connect to mongodb
const mongoose = require('mongoose');
// export the model constructor, which we will use for create new event
const Event = require('./models/event');
const User = require('./models/user');

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

    // if we have relationship with User collection (example creator) then it we can use type name, ex:
    // creator: User! 
    // or we have has many relation like users have more event then we can declare type like this:
    // createdEvents: [Event!]
    // NOte 1: if we use other Type in relationship then we apply same rules to it!
    // Note 2: need populate method after find (need field name), which get the relations from mongodb, ex.: .populate('creator')

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
            creator: User!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(myEventInput: EventInput): Event
            createUser(myUserInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            // Event.find({title: "test"});
            return Event.find().populate('creator')
            .then( events => {
                return events.map(event => {
                    return {...event._doc }
                    // some case _id is object and need to convert to string
                    // return {...event._doc, _id: event._doc._id.toString() }
                    // or use property what added by mongoose "id"
                    // return {...event._doc, _id: event.id }
                });
            })
            .catch(err => {
                throw err;
            });
            return events;
        },
        createEvent: args => {
            // create a new mongodb model
            const event = new Event({
                title: args.myEventInput.title,
                description: args.myEventInput.description,
                price: +args.myEventInput.price,
                date: new Date(args.myEventInput.date),
                creator: '5c5e5b1a9ea00201f09da9b8'
            });

            let createdEvent;
            // save the model
            return event
              .save()
              .then(result => {
                  // it was saved and we get the core doc properties and we set reult into variable
                  createdEvent = {...result._doc};
                  // some case _id is object and need to convert to string
                  // return {...result._doc, _id: result._doc._id.toString() }
                  // or use property what added by mongoose "id"
                  // return {...result._doc, _id: result.id) }

                  // check if user exist in db
                  return User.findById(event.creator);
              })
              .then(user => {
                  if(!user) {
                      throw new Error('User not exist');
                  }
                  // push is mongodb feature, we pass event object wich was updated after save
                  // and mongodb use id from event
                  console.log(user);
                  user.createdEvents.push(event);
                  return user.save();
              })
              .then(result => {
                  // it will return the createdEvent
                  return createdEvent;
              }).catch(err => {
                  console.log(err);
                  throw err;
              });
        },
        createUser: args => {
            // lets check if email is user or no
            return User.findOne({email: args.myUserInput.email}).then( user => {
                if(user) {
                    throw new Error('User email already exist');
                }
                // if not exist email in suers then encrypt password
                // for encrypt the string we need the string and salt (string or number)
                // bcrypt is async/promise
                return bcrypt.hash(args.myUserInput.password, 12);
            }).then( hashedPassword => {
                // we create a new model with our data
                const user = new User({
                    email: args.myUserInput.email,
                    password: hashedPassword
                });
                console.log(user);
                // return another promise from mooogse
                return user.save();
            })
            // promise chain: if user was saved then we return the data
            .then( result => {
                // but without password
                console.log( { ...result._doc, password:null, _id: result.id });
                return { ...result._doc, password:null, _id: result.id };
            })
            .catch(err => {
                throw err;
            });
        },
    },
    graphiql: true
}));

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
        console.log('kakukk');
        app.listen(3000);
    })
    .catch( err => console.log(err) );


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
