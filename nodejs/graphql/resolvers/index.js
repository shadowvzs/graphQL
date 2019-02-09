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
        if (!events) { return false; }
        return events.map( event => formatEvent(event) );
    } catch(err) { 
        throw err;
    };
}

// get user from users collection (by id)
const user = async userId => {
    try {
        const user = await User.findById(userId);
        if (!user) { return false; }
        return formatUser(user);
    } catch(err) { 
        throw err;
    };
}

// get a single event (by id)
const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        if (!event) { return false; }
        return formatEvent(event);
    } catch(err) { 
        throw err;
    };
}


const formatUser = user => {
    return ({
        ...user._doc, 
        _id: user.id,
        createdEvents: events.bind(this, user.createdEvents)
    });    
}

const formatEvent = event => {
    return ({
        ...event._doc, 
        _id: event.id,
        creator: user.bind(this, event.creator)
    });    
}

const formatBooking = booking => {
    return ({
        ...booking._doc, 
        _id: booking.id,
        event: singleEvent.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user),
        createdAt: new Date(booking._doc.createdAt).toISOString(), 
        updatedAt: new Date(booking._doc.updatedAt).toISOString(), 
    });    
}



module.exports = {

    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => formatEvent(event));
        } catch(err) { 
            throw err;
        };
    },

    bookings: async args => {
        try {
            const bookings = await Booking.find();
            return bookings.map( booking => formatBooking(booking));
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
            const savedEvent = await event.save();
            const creatorUser = await User.findById(event.creator);             
            if(!creatorUser) {
                throw new Error('User not exist');
            }
            creatorUser.createdEvents.push(event);
            await creatorUser.save();
            return formatEvent(savedEvent);
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
            const savedUser = await user.save();
            return formatUser(savedUser);
        } catch(err) { 
            throw err;
        };      
    },

    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findById(args.eventId);
            const booking = new Booking({
                user: '5c5e5b1a9ea00201f09da9b8',
                event: fetchedEvent._id
            });
            const result = await booking.save();
            return formatBooking(result);
        } catch(err) { 
            throw err;
        };    
    },

    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId);
            if (!booking) {
                throw "Booking not exist";
            }
            if (!await Booking.deleteOne({_id: booking.id})) {
                throw "Booking cannot be deleted";
            }
            const event = await singleEvent(booking.event);
            if (!event) {
                throw "Event not exist";
            }
            return event;
        } catch(err) { 
            throw err;
        };   
    },

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

* mutation {
*   cancelBooking(bookingId: "5c5e82592036f8069865c9d7") {
*     _id
*      title
*     creator {
*       _id
*     }
*   }
* }
*
* Strongest point in graphQL is if we call a nested type then it will be loaded 
* from mongodb else we don't bother with loading that nested object
*
*
*/
