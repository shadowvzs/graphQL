const mongoose = require('mongoose');
// extract a constructor gunction from mongoose
const Schema = mongoose.Schema;
// we define a new schema with his structure, field types etc
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        // id from User model
        type: Schema.Types.ObjectId,
        // relationship with User model which must be defined both side
        ref: 'User'
    },
    enrolledUsers: {
        // id from User model
        type: Schema.Types.ObjectId,
        // relationship with User model which must be defined both side
        ref: 'Booking'        
    }
});

// create model with a name and based on schema
// it will be saved to myDB/events/ - collection name is in plural with lowercase letters
module.exports = mongoose.model('Event', eventSchema);
