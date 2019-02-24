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
             // graphiql: true      // only for development!, awasome help before you have frontend (host:port/graphiql in bworser)
         }));  ```
  * in middlware we must declare: 
      * root **Shema**: this contain all schema, more information below
      * root **Resolver**: this contain all resolver, more information below
      * graphiql *(optional)*: interactive debuging for browser, for **development only**
      
      
##### Schema:
* string which describe types what we use
    * How it look our first schema (i use query and mutation):
```javascript
        schema {
            query: RootQuery
            mutation: RootMutation
        }
```
    * lets make root query & mutation types:
```javascript   
        type RootQuery {
            events: [Event!]!
            login(email: String!, password: String!): AuthData
        }

        type RootMutation {
            createEvent(myEventInput: EventInput): Event
            createUser(myUserInput: UserInput): User
        }
```
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
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData
        }

        type RootMutation {
            createEvent(myEventInput: EventInput): Event
            createUser(myUserInput: UserInput): User
            bookEvent(eventId: ID!) : Booking!
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
```
    * we can declare our own types aswell like user model structure
    * scalar values: Int, Float, String, Boolean, ID
