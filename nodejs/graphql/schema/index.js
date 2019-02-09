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

