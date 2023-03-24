const request = require('supertest');
const express = require('express');
const quoteRoute = require('../routes/quoteRoute');
const { getAllQuotes, createOneQuote, getUserQuotes } = require('../controllers/quoteController');
const { verifyToken } = require('../middlewares/verifyToken');

jest.mock('../controllers/quoteController');
jest.mock('../middlewares/verifyToken');

const app = express();
app.use(express.json());
app.use('/api/quotes', quoteRoute);

describe('quoteRoute', () => {
  describe('GET /api/quotes/quoteHistory', () => {
    it('should return all quotes', async () => {
      const quotes = [
        { _id: '1', text: 'Quote 1', author: { name: 'Author 1' } },
        { _id: '2', text: 'Quote 2', author: { name: 'Author 2' } },
      ];
      getAllQuotes.mockResolvedValue(quotes);

      const res = await request(app).get('/api/quotes/quoteHistory');

      expect(getAllQuotes).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'Success',
        results: quotes.length,
        data: { quotes },
      });
    });
  });

  describe('POST /api/quotes/fuelQuote', () => {
    it('should create a new quote', async () => {
      const reqBody = { text: 'Quote text' };
      const quote = { _id: 'quote-id', text: 'Quote text', author: 'user-id' };
      createOneQuote.mockResolvedValue({ quote });

      const res = await request(app).post('/api/quotes/fuelQuote').send(reqBody);

      expect(verifyToken).toHaveBeenCalled();
      expect(createOneQuote).toHaveBeenCalledWith(
        { user: { userId: 'user-id' }, body: reqBody },
        expect.anything(),
        expect.anything()
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'Success',
        data: { quote },
      });
    });
  });

  describe('GET /api/quotes/userQuotes/:userId', () => {
    it('should return all quotes by a user', async () => {
      const quotes = [
        { _id: '1', text: 'Quote 1', author: { name: 'Author 1' } },
        { _id: '2', text: 'Quote 2', author: { name: 'Author 2' } },
      ];
      getUserQuotes.mockResolvedValue(quotes);

      const res = await request(app).get('/api/quotes/userQuotes/user-id');

      expect(getUserQuotes).toHaveBeenCalledWith(
        { params: { userId: 'user-id' } },
        expect.anything(),
        expect.anything()
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'Success',
        results: quotes.length,
        data: { quotes },
      });
    });
  });
});
