const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { singleEvent, formatEvent, formatBooking } = require('./merge');


module.exports = {

    bookings: async (args,req) => {
    	// we give error if user not logged in
    	if (!req.isAuth) {
    		throw new Error('Unauthenticated!'); 
    	} 
        try {
            const bookings = await Booking.find();
            return bookings.map( booking => formatBooking(booking));
        } catch(err) { 
            throw err;
        };    
    },

    bookEvent: async (args, req) => {
    	// we give error if user not logged in
    	if (!req.isAuth) {
    		throw new Error('Unauthenticated!'); 
    	}     	
        try {
            const fetchedEvent = await Event.findById(args.eventId);
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent._id
            });
            const result = await booking.save();
            return formatBooking(result);
        } catch(err) { 
            throw err;
        };    
    },

    cancelBooking: async (args,req) => {
        // we give error if user not logged in
    	if (!req.isAuth) {
    		throw new Error('Unauthenticated!'); 
    	} 	
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