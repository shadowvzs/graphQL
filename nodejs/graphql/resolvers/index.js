// we encrypt password and for this we use bcryptjs module
const bcrypt = require('bcryptjs');
// import the model constructor, which we will use for create new event and user
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

// get events from events collection (by ids)
const events = async eventIds => {
    // we search after array of ids, ex.: _id: {$in: eventsIds}
    try {
        const events = await Event.find({ _id: {$in: eventIds}} );
        return events.map( event => {
            return {
                ...event._doc, 
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        });
    } catch(err) { 
        throw err;
    };
}

// get user from users collection (by id)
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return ({
            ...user._doc, 
            _id: user.id,
            createdEvents: events.bind(this, user.createdEvents)
        });
    } catch(err) { 
        throw err;
    };
}


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc, 
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(), 
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch(err) { 
            throw err;
        };
    },
    bookings: async args => {
        try {
            const bookings = await Booking.find();
            return bookings.map( booking => {
                return {
                    ...booking._doc, 
                    _id: booking.id,
                    event: events.bind(this, [booking._doc.event]),
                    user: user.bind(this, booking._doc.user),
                    createdAt: new Date(booking._doc.createdAt).toISOString(), 
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(), 
                };
            });
        } catch(err) { 
            throw err;
        };    
    },
    createEvent: async args => {
        // create a new mongodb model
        try {
            const event = new Event({
                title: args.myEventInput.title,
                description: args.myEventInput.description,
                price: +args.myEventInput.price,
                date: new Date(args.myEventInput.date),
                creator: '5c5e5b1a9ea00201f09da9b8'
            });

            let createdEvent;
            // save the model
            let savedEvent = await event.save();
            const creatorUser = await User.findById(event.creator);             
            if(!creatorUser) {
                throw new Error('User not exist');
            }
            creatorUser.createdEvents.push(event);
            await creatorUser.save();
            return {
                _id: event.id,
                ...event._doc, 
                creator: user.bind(this, event.creator)
            }
        } catch(err) { 
            throw err;
        };
    },
    createUser: async args => {
        // lets check if email is user or no
        try {
            if (await User.findOne({email: args.myUserInput.email})) {
                throw new Error('User email already exist');
            }
            const hashedPassword = await bcrypt.hash(args.myUserInput.password, 12);
            const user = new User({
                email: args.myUserInput.email,
                password: hashedPassword
            });
            await user.save();
            return { ...user._doc, password: null, _id: user.id };
        } catch(err) { 
            throw err;
        };      
    },
    bookEvent: async args => {
        //5c5e73b1241d0f059bc231c7
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: '5c5e5b1a9ea00201f09da9b8',
            event: fetchedEvent._id
        });
        const result = await booking.save();
        return {
            ...result._doc, 
            _id: result.id,
            event: events.bind(this, [result._doc.event]),
            user: user.bind(this, result._doc.user),
            createdAt: new Date(result._doc.createdAt).toISOString(), 
            updatedAt: new Date(result._doc.updatedAt).toISOString(),            
        }
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
