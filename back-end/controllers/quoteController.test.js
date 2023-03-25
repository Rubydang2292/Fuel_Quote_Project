const quoteController = require('./quoteController');
const Quote = require('../models/Quote');

jest.mock('../models/Quote');

describe('quoteController', () => {
  describe('getAllQuotes', () => {
    it('should return all quotes', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const quotes = [
        { _id: '1', text: 'Quote 1', author: { name: 'Author 1' } },
        { _id: '2', text: 'Quote 2', author: { name: 'Author 2' } },
      ];
      Quote.find.mockResolvedValue(quotes);

      await quoteController.getAllQuotes(req, res);

      expect(Quote.find).toHaveBeenCalledWith({}).populate('author');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Success',
        results: quotes.length,
        data: { quotes },
      });
    });

    it('should handle errors', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };

      const error = new Error('Database connection error');
      Quote.find.mockRejectedValue(error);

      const next = jest.fn();

      await quoteController.getAllQuotes(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createOneQuote', () => {
    it('should create a new quote', async () => {
      const req = {
        user: { userId: 'user-id' },
        body: {
          text: 'Quote text',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const quote = {
        _id: 'quote-id',
        text: 'Quote text',
        author: 'user-id',
      };
      Quote.create.mockResolvedValue(quote);

      await quoteController.createOneQuote(req, res);

      expect(Quote.create).toHaveBeenCalledWith({ ...req.body, author: 'user-id' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Success',
        data: { quote },
      });
    });

    it('should handle errors', async () => {
      const req = {
        user: { userId: 'user-id' },
        body: {
          text: 'Quote text',
        },
      };
      const res = {
        json: jest.fn(),
      };

      const error = new Error('Database connection error');
      Quote.create.mockRejectedValue(error);

      const next = jest.fn();

      await quoteController.createOneQuote(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserQuotes', () => {
    it('should return all quotes by a user', async () => {
      const req = {
        params: {
          userId: 'user-id',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const quotes = [
        { _id: '1', text: 'Quote 1', author: { name: 'Author 1' } },
        { _id: '2', text: 'Quote 2', author: { name: 'Author 2' } },
      ];
      Quote.find.mockResolvedValue(quotes);

    //   await quoteController.getUserQuotes(req, res);

    //   expect(Quote.find).toHaveBeenCalledWith({ author: 'user-id' });
    //   expect(res.status).


    });
  });
});