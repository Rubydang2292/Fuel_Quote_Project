const User = require('../models/User');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

// Have to use async/await because of connecting with database
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

        // Find user email with parameter is information when user inputs in the form
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            const err = new Error('Email is not correct')
            err.statusCode = 400;
            return next(err)
        }

        //body.password: pass client inputs in the form
        //user.password: pass is hashed
        //compareSync: function to compare 2 passwords
        if (bcrypt.compareSync(req.body.password, user.password)) {

            // Create TOKEN
            const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET)

            // response back to client if successfully connect to DB
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
            // Error: Password is not correct.
            const err = new Error('Password is not correct')
            err.statusCode = 400;
            return next(err) // send this error to errorHandler
        }

    } catch (error) {
        res.json(error)
    }
}


// Get current User
exports.getCurrentUser = async (req, res, next) => {
    try {
        const data = { user: null };
        if (req.user) {
            const user = await User.findOne({ _id: req.user.userId });
            data.user = {  // assign object into user, then assign into data
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
        
        // find() will return an array of quotes
        const users = await User.find({});

        // response back to client if successfully connect to DB
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