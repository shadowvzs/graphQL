// we encrypt password and for this we use bcryptjs module
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    login: async ({ email, password}) => {
    	const user = await User.findOne({ email });
    	if (!user) {
    		throw new Error('User does not exist');
    	}
    	// compare the raw password with one from database
    	const isEqual = await bcrypt.compare(password, user.password);
    	if (!isEqual) {
    		// could be same than user error, so we don't give hint
    		throw new Error('Wrong password!');
    	}
    	// configure the token:
    	//  #1 param: data what we want save into token
    	//  #2 param: secret/private key
    	//  #3 param: expiration time (optional)
    	const token = await jwt.sign(
    		{ userId: user.id,email: user.email }, 
    		'as2cdnjiZXwqklho129uZXnpoquwe', 
    		{ expiresIn: '1h'}
    	);

    	return ({
    		userId: user.id,
    		token: token,
    		tokenExpiration: 1
    	});
    }
};