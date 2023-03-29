const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should save a user with hashed password', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword',
      address1: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipcode: 12345,
      isAdmin: 'false',
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(userData.name);
    expect(foundUser.email).toBe(userData.email);
    expect(foundUser.password).not.toBe(userData.password);
    expect(bcrypt.compareSync(userData.password, foundUser.password)).toBe(true);
  });

  test('should throw an error when required fields are missing', async () => {
    const userData = {
      password: 'testpassword',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toThrowError();
  });
});
