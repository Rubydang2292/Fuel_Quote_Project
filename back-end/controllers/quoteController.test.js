const request = require('supertest');
const express = require('express');
const app = express();
const Quote = require('../models/Quote');
const quoteController = require('../controllers/quoteController');

app.use(express.json());
app.get('/quotes', quoteController.getAllQuotes);
app.post('/quotes', quoteController.createOneQuote);
app.get('/quotes/user/:userId', quoteController.getUserQuotes);

jest.mock('../models/Quote');

describe('quoteController', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getAllQuotes', async () => {
    const mockQuotes = [
      { _id: '1', text: 'Test quote 1', author: 'Author 1' },
      { _id: '2', text: 'Test quote 2', author: 'Author 2' },
    ];

    Quote.find.mockResolvedValue(mockQuotes);

    const res = await request(app).get('/quotes');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'Success',
      results: 2,
      data: { quotes: mockQuotes },
    });
    expect(Quote.find).toHaveBeenCalledWith({});
  });

  test('createOneQuote', async () => {
    const mockQuote = { _id: '1', text: 'Test quote', author: 'Author' };
    const reqBody = { text: 'Test quote' };

    Quote.create.mockResolvedValue(mockQuote);

    const res = await request(app).post('/quotes').send(reqBody);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'Success',
      data: { quote: mockQuote },
    });
    expect(Quote.create).toHaveBeenCalledWith(expect.objectContaining(reqBody));
  });

  test('getUserQuotes', async () => {
    const mockUserId = 'user1';
    const mockUserQuotes = [
      { _id: '1', text: 'Test quote 1', author: mockUserId },
      { _id: '2', text: 'Test quote 2', author: mockUserId },
    ];

    Quote.find.mockResolvedValue(mockUserQuotes);

    const res = await request(app).get(`/quotes/user/${mockUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'Success',
      results: 2,
      data: { quotes: mockUserQuotes },
    });
    expect(Quote.find).toHaveBeenCalledWith({ author: mockUserId });
  });
});
