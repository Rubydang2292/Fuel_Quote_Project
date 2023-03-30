const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Quote = require("../models/Quote");

describe('Quote Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Quote.deleteMany({});
  });

  test('should create a quote successfully', async () => {
    const quote = new Quote({
      gallons: 100,
      delivery_address: '123 Street Name',
      delivery_date: new Date(),
      suggested_price: 1.5,
      total_amount: 150,
      author: new mongoose.Types.ObjectId(),
    });

    const savedQuote = await quote.save();
    expect(savedQuote).toHaveProperty('_id');
    expect(savedQuote).toHaveProperty('gallons', 100);
    expect(savedQuote).toHaveProperty('delivery_address', '123 Street Name');
    expect(savedQuote).toHaveProperty('delivery_date');
    expect(savedQuote).toHaveProperty('suggested_price', 1.5);
    expect(savedQuote).toHaveProperty('total_amount', 150);
    expect(savedQuote).toHaveProperty('author');
  });

  test('should throw an error if gallons are not provided', async () => {
    const quote = new Quote({
      delivery_address: '123 Street Name',
      delivery_date: new Date(),
      suggested_price: 1.5,
      total_amount: 150,
      author: new mongoose.Types.ObjectId(),
    });

    try {
      await quote.save();
    } catch (error) {
      expect(error).toHaveProperty('message');
      expect(error.message).toMatch(/gallons is required/);
    }
  });
});
