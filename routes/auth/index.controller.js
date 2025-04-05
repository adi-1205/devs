const bcrypt = require('bcryptjs');
const { ReE, ReS, jwtSign } = require('../../helper');
const User = require('../../database/models/user.model');
const { ROLE } = require('../../config/constants');

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const exiting = await User.findOne({ email });

        if (exiting) {
            return ReE(res, 400, 'User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { _doc } = await User.create({
            ...req.body,
            password: hashedPassword,
            role: ROLE.CLIENT,
        });

        const {_id, password: _, ...user} = _doc;

        return ReS(res, 'User created successfully', user);
    } catch (err) {
        console.log('Error in register client', err);
        return ReE(res, 500, 'Internal server error');
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            return ReE(res, 400, 'Email and password are required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return ReE(res, 400, 'User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return ReE(res, 400, 'Invalid credentials');
        }

        const token = jwtSign({ email });

        return ReS(res, 'logged in', { token});
    } catch (err) {
        console.log('Error in login', err);
        return ReE(res, 500, 'Internal server error');
    }
}

module.exports = {
    register,
    login,
}