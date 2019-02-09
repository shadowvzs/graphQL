// we encrypt password and for this we use bcryptjs module
const bcrypt = require('bcryptjs');
// import the model constructor, which we will use for create new event and user
const Event = require('../../models/event');
const User = require('../../models/user');

// get events from events collection (by ids)
const events = eventIds => {
    // we search after array of ids, ex.: _id: {$in: eventsIds}
    return Event.find({ _id: {$in: eventIds}} )
        .then(events => events.map( event => {
            return {
              ...event._doc, 
              _id: event.id,
              creator: user.bind(this, event.creator)
            }
        }))
        .catch(err => { throw err });
}

// get user from users collection (by id)
const user = userId => {
    return User.findById(userId)
        .then(user => {
          return {
            ...user._doc, 
            _id: user.id,
            createdEvents: events.bind(this, user.createdEvents)
          }
        })
        .catch(err => { throw err });
}


module.exports = {
    events: () => {
        // Event.find({title: "test"});
        return Event.find()
        .then( events => {
            return events.map(event => {
                return {
                  ...event._doc, 
                  _id: event.id, 
                  creator: user.bind(this, event._doc.creator)
                }
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
              createdEvent = {
                ...result._doc,
                _id: result.id,
                creator: user.bind(this, result.creator)
              };
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
    }
};



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
* // Test nested relations
*
* query {
*   events {
*     title
*     creator {
*       createdEvents {
*         creator {
*           email
*         }
*       }
*     } 
*   }
* }
*
*
*
*
*/
