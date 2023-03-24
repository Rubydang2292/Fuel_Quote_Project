const express = require('express');

const {getAllQuotes, createOneQuote, getUserQuotes} = require('../controllers/quoteController.js');

const {verifyToken} = require('../middlewares/verifyToken');

const Router = express.Router();

Router.route('/quoteHistory').get(getAllQuotes);

// verify Token first then create quote
// after verifyToken done, next() will go to createOneQuote
Router.route('/fuelQuote').post(verifyToken, createOneQuote);

Router.route('/userQuotes/:userId').get(getUserQuotes)

module.exports = Router;