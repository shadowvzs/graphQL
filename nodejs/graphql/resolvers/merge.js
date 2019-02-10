const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

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

const formatEvent = async event => {
    return ({
        ...event._doc, 
        _id: event.id,
        date: dateToString(event.date),
        creator: user.bind(this, event.creator.toString())
    });    
}

const formatBooking = booking => {
    return ({
        ...booking._doc, 
        _id: booking.id,
        event: singleEvent.bind(this, booking._doc.event),
        user: user.bind(this, booking._doc.user),
        createdAt: dateToString(booking._doc.createdAt), 
        updatedAt: dateToString(booking._doc.updatedAt), 
    });    
}

//exports.user = user;
//exports.events = events;
exports.singleEvent = singleEvent;
exports.formatEvent = formatEvent;
exports.formatBooking = formatBooking;