// dataloader used to make effecient the situations when we need same data
// example more event got same user, then it cache user and after first time
// we use the cached data and not need to make another mongo db query for it
// dataLoader prevent the dublicate requests
const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

// its got a param unction, which acctually a plus layer between
// raw id and events function, make cacheing for us
// NOTE: for dataloader need keys (ex. id, name etc)
const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds } });
});

// get events from events collection (by ids)
const events = async eventIds => {
    // we search after array of ids, ex.: _id: {$in: eventsIds}
    try {
        const events = await Event.find({ _id: {$in: eventIds}} );
        // we must sort the events because if we search with in array then not sure we get back in same order
        // so we want get back in same order than we gived the ids
        // important for dataloader too, if we have ids & retrived data in same order
        events.sort((a, b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
        });
        if (!events) { return false; }
        return events.map( event => formatEvent(event) );
    } catch(err) { 
        throw err;
    };
}

// get user from users collection (by id)
const user = async userId => {
    try {
        // why we need toString? because loader compare data, let only the unique values
        // but if it is object then checking is fail because 2 object even with same value
        // not will be egual with eachother so we must be sure, userId isn't object 
        // and it must but primitive string
        const user = await userLoader.load(userId.toString());
        if (!user) { return false; }
        return formatUser(user);
    } catch(err) { 
        throw err;
    };
}

// get a single event (by id)
const singleEvent = async eventId => {
    try {
        // this is how we use the event loader with id
        const event = await eventLoader.load(eventId.toString());
        if (!event) { return false; }
        return event;
        // return formatEvent(event);
    } catch(err) { 
        throw err;
    };
}

const formatUser = user => {
    return ({
        ...user._doc, 
        _id: user.id,
        // dataloader useage for multiple id :)
        createdEvents: () => eventLoader.loadMany(user.createdEvents)
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
exports.formatUser = formatUser;