const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    try {
        const {name, email, password} = req.body;

        const newUser = new User({name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }  catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function loginUser(req, res){
    try{
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user) {
           return res.status(400).json({ error: 'Invalid email or password' });
        } else if (user){
            const isMatch = await user.comparePassword(password);
            if(!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            } else {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  
                res.status(200).json({ token });
            }
        }
    } catch( err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { registerUser, loginUser };