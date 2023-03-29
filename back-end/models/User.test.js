require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./User');

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  }, 10000); // increase timeout value to 10 seconds

  it('should create a new user', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
    });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
    });
    await user.save();
    expect(user.password).not.toBe('test1234');
  });

  it('should require name, email, and password', async () => {
    const user = new User({});
    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should require password to be at least 6 characters', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '12345',
    });
    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should enforce unique name and email', async () => {
    const user1 = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
    });
    const user2 = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test5678',
    });
    let error;
    try {
      await user1.save();
      await user2.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000);
  });
});
