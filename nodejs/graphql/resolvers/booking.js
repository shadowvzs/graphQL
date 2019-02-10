const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { singleEvent, formatEvent, formatBooking } = require('./merge');


module.exports = {

    bookings: async args => {
        try {
            const bookings = await Booking.find();
            return bookings.map( booking => formatBooking(booking));
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