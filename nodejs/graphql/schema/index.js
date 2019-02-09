// buildSchema help to build a js object literal
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
    `);

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
    // Note 2: 
    //    a) need populate method after find (need field name), which get the relations from mongodb, ex.: .populate('creator')
    //    b) search manually after relations with a function

    // if createEvent(name: String): String
    // then in createEvent function must enter a string and return a string

    // Event is custom type here which could have any name :)
    // in types we have name: type pairs
    // id must have ID type with !
