const mongoose = require('mongoose');
// extract a constructor gunction from mongoose
const Schema = mongoose.Schema;
// we define a new schema with his structure, field types etc
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // we use array for user events, like array prop, User.createdEvents = []
    createdEvents: [
      {
          // this will be id from event model
          type: Schema.Types.ObjectId,
          // set relation with other model, must be defined both here and in other model
          ref: 'Event'
      }
    ]
});

// create model with a name and based on schema
// it will be saved to myDB/users/ - collection name is in plural with lowercase letters
module.exports = mongoose.model('User', userSchema);
