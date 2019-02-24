# graphQL
GraphQL, Express, ReactJS basic project for fun


* Frontend: 
  * ReactJS
      * React Router v4
      * React Context
      * React Chart JS 2
      
* Backend: 
  * Express 
      * Mongoose ( for mongoDB )
      * GraphQL (inc. dataloader)
      * JWT (for auth)
      * other: bcrypt, body-parser
 
 ----------------------------------
      
#### Features *(with graphQL)*:
- auth user (login/registration/authed resolvers) with jwt/bcrypt
- modal/spinner on frontend
- create/cancel event
- book event/cancel book event

---------------------------------

## About GraphQL

#### Why would be used GraphQL:
* we have a single endpoint (ex.: ***http://172.18.0.3:8000/graphql***)
* we describe which data we need from client side (in our request body we describe what we send/need)
* we get ***only*** that data what we need (we get the fields exactly what we need, no useless data)
* we can get ***nested/relationed*** data - works like charm with mongoDB
* got type verification
* support 3 kind of query but we allways send data with **POST** method:
       * ***query***: *GET* like request where we need data from server
       * ***mutation***: *POST/PUT/DELETE* like requests when we want change something in database
       * ***subscription***: websocket like communication



#### Client side:

* **Note:**
  * method must be ***POST***
  * endpoint allways same ex. ***http://172.18.0.3:8000/graphql***
  * data is object with ***query***, ***variables*** keys
      * **query**: string wich describe what we send and what data we need from server (check backend ***schema***) 
          * in query string we have  type of query:
              * ***query***: *GET* like request where we need data from server
              * ***mutation***: *POST/PUT/DELETE* like requests when we want change something in database
              * ***subscription***: websocket like communication
      * **variables**: the point where we insert variables, if in query we used ***$email*** then we must ***email*** key in variables
  
  * **Example:**

```javascript
        let requestBody = {
            query: `
              query loginUser($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                      userId
                      token
                      tokenExpiration
                  }
            }`,
            variables: {
              email: email,
              password: password
            }
        };

        const headers = { 'Content-Type': 'application/json' };
        fetch("http://172.18.0.3:8000/graphql", { 
               method: 'POST', 
               body: JSON.stringify(requestBody), 
               headers 
        });
```


#### Server side (in our case with express)

* **Note:**
  * must use the graphQL middleware (ex. package *express-graphql*)
```javascript
         app.use('/graphql', graphqlHttp({
             schema: graphQlSchema,
             rootValue: graphQlResolvers,
             // graphiql: true      
             // only for development!, awasome help before you have frontend (host:port/graphiql in browser)
         }));  
```
  * in middlware we must declare: 
      * root **Shema**: this contain all schema, more information below
      * root **Resolver**: this contain all resolver, more information below
      * graphiql *(optional)*: interactive debuging for browser, for **development only**
      
      
##### Schema:
* string which describe types what we use (we use query and mutation):
    * lets make root query & mutation types:
    * types
         * we can declare our own types aswell like user model structure
         * we can use scalar values: Int, Float, String, Boolean, ID
         * we can use array from types like [Float] or [User]
         * if we use "!" like String! or User! then required
    * now lets all together (included model structure - must match with mongodb schema):
```javascript
        const graphQlSchema = buildSchema(`

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

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }        

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            login(email: String!, password: String!): AuthData
        }

        type RootMutation {
            createEvent(myEventInput: EventInput): Event
            createUser(myUserInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
```
##### Resolvers:
   * resolver is the logic behind the schema
   * we can use rootResolver and split up the resolver into more files
   * look like
   
```javascript
// root resolver
const authResolver = require('./auth');
const eventsResolver = require('./events');

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
}

module.exports = rootResolver;
```
Simple example without checkings about how look like the auth resolver

```javascript
// we encrypt password and for this we use bcryptjs module
const User = require('../../models/user');
const { formatUser } = require('./merge');

module.exports = {
    createUser: async args => {
        try {
            if (await User.findOne({email: args.myUserInput.email})) {
                throw new Error('User email already exist');
            }
            const hashedPassword = /* we use something for hash the password */;
            // myUserInput coming from schema, check auth schema
            const user = new User({
                email: args.myUserInput.email,
                password: hashedPassword
            });
            const savedUser = await user.save();
            // format user isn't here but its actually return the saved data 
            // + make query after event which related with this user
            return formatUser(savedUser);
        } catch(err) { 
            throw err;
        };      
    },
    login: async ({ email, password}) => {
    	const user = await User.findOne({ email });
     // check if user is empty then check if password match
     const token = /* create token */

    	return ({
    		userId: user.id,
    		token: token,
    		tokenExpiration: 1
    	});
    }
};
```

our model
```javascript
const mongoose = require('mongoose');
// extract a constructor gunction from mongoose
const Schema = mongoose.Schema;
// we define a new mongoDB schema with his structure (confused with graphQL schema), field types etc
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // we use array for user events, like array prop, User.createdEvents = []
    createdEvents: [
      {
          // this will be id from event model
          type: Schema.Types.ObjectId,
          // set relation with other model, must be defined both here and in other model
          ref: 'Event'
      }
    ]
});

// User is the mongoDB collection name, actually here we use singular but it is plural in mongoDB like users collection 
module.exports = mongoose.model('User', userSchema);
```

Users could have more event (CreatedEvents property, contain id objects) and every event got a creator (id object)
