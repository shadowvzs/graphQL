// we encrypt password and for this we use bcryptjs module
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { formatUser } = require('./merge');

module.exports = {
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
};