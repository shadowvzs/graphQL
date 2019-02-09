const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// if we set timestamps to true in mongoDb schema then automatically 
// will be created_at, updated_at field
const bookingSchema = new Schema({
	event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
	},
	user: {
        type: Schema.Types.ObjectId,
        ref: 'User'		
	}
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);