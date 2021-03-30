const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User.model');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');


const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },
    SECRET_KEY, 
    { expiresIn: '1h' });
}

module.exports = {
    Mutation: {

        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            
            if(!valid) {
                throw new UserInputError("User credentials errors", { errors });
            }
            
            const user = await User.findOne({ username });
            if(!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', { errors });
            }
            
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = "Wrong credentials";
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } }, ) {
            
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError("Errors", { errors });
            }
            
            const user = await User.findOne({ username });
            if(user) {
                throw new UserInputError('user name already exists', {
                    errors: {
                        username: 'This username already exists'
                    }
                })
            }
            
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}