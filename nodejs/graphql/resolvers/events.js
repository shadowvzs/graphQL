const User = require('../../models/user');
const Event = require('../../models/event');
const { events, formatEvent } = require('./merge');

module.exports = {

    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => formatEvent(event));
        } catch(err) { 
            throw err;
        };
    },
    // we get arguments but request object too, where we can check if user is logged in or no
    createEvent: async (args, req) => {
    	// we give error if user not logged in
    	if (!req.isAuth) {
    		throw new Error('Unauthenticated!'); 
    	} 
    	
        // create a new mongodb model
        try {
            const event = new Event({
                title: args.myEventInput.title,
                description: args.myEventInput.description,
                price: +args.myEventInput.price,
                date: new Date(args.myEventInput.date),
                creator: '5c5e73a9241d0f059bc231c6'
            });

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
    }
};