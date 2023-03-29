const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    gallons: {
        type: Number,
        trim: true,
        required: [true, 'gallons must be required']
    },

    delivery_address: {
        type: String,
        trim: true
    },

    delivery_date: {
        type: Date,
        trim: true
    },

    suggested_price: {
        type: Number,
        trim: true
    },

    total_amount: {
        type: Number,
        trim: true
    },

    // this will return all information from User model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
}) 

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;

