const Quote = require('../models/Quote');

// Get all quotes
exports.getAllQuotes = async (req, res, next) =>{
    try {
        
        // find() will return an array of quotes
        const quotes = await Quote.find({}).populate('author');

        // response back to client if successfully connect to DB
        res.status(200).json({
            status: 'Success',
            results: quotes.length,
            data: { quotes }
        });

    } catch (error) {
        res.json(error);
    }
};


// Create one quote
exports.createOneQuote = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const quote = await Quote.create( {...req.body, author: userId} );

        // response back to client if successfully connect to DB
        res.status(200).json({
            status: 'Success',
            data: { quote }
        });

    } catch (error) {
        next(error);
    }
}

// Get all quotes
exports.getUserQuotes = async (req, res, next) =>{
    try {
        const { userId } = req.params;
        // find() will return an array of quotes
        const quotes = await Quote.find({author: userId})

        // response back to client if successfully connect to DB
        res.status(200).json({
            status: 'Success',
            results: quotes.length,
            data: { quotes }
        });

    } catch (error) {
        res.json(error);
    }
};