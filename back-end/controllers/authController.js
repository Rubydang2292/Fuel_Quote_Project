const User = require('../models/User');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
    try {

        // req.body has name, email, password which user inputs it.
        // Use these data to create a user in DB ( using create() )
        const user = await User.create(req.body)

        // Create TOKEN after register
        const token = jwt.sign({ userID: user._id }, process.env.APP_SECRET);

        // response back to client if successfully connect to DB
        res.status(200).json({
            status: 'Success',
            data: { token, userName: user.name }
        });

    } catch (error) {
       next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            const err = new Error('Email is not correct')
            err.statusCode = 400;
            return next(err)
        }

        if (bcrypt.compareSync(req.body.password, user.password)) {

            const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET)

            res.status(200).json({
                status: 'Success',
                data: {
                    token,
                    userId: user._id,
                    name: user.name,
                    address1: user.address1,
                    address2: user.address2,
                    city: user.city,
                    state: user.state,
                    zipcode: user.zipcode,
                    isAdmin: user.isAdmin
                }
            });

        } else {
            const err = new Error('Password is not correct')
            err.statusCode = 400;
            return next(err)
        }

    } catch (error) {
        res.json(error)
    }
}

exports.getCurrentUser = async (req, res, next) => {
    try {
        const data = { user: null };
        if (req.user) {
            const user = await User.findOne({ _id: req.user.userId });
            data.user = {
                userId: user._id,
                address1: user.address1,
                address2: user.address2,
                city: user.city,
                state: user.state,
                zipcode: user.zipcode,
                name: user.name,
                isAdmin: user.isAdmin
            }
        }

        res.status(200).json({
            status: 'success',
            data: data
        })

    } catch (error) {
        res.json(error);
    }
};

// Update Current User
exports.updateCurrentUser = async (req, res, next) =>{
    try{

        const { userId } = req.params;

        const userProfile = await User.findByIdAndUpdate(userId, {...req.body}, {new: true, runValidator: true})

        res.status(200).json({
            status: 'success',
            data: {userProfile}
        })
    }catch (error){
        next(error)
    }
}

// Get All User
exports.getAllUser = async (req, res, next) =>{
    try {
        const users = await User.find({});

        res.status(200).json({
            status: 'Success',
            results: users.length,
            data: {
                userId: users._id, 
                users 
            }
        });

    } catch (error) {
        res.json(error);
    }
};
