const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost/test', {
      useNewUrlParser: true,
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


  test('should throw an error when email is invalid', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid_email',
      password: 'testpassword',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toThrowError(/Please enter a valid email address/);
  });

  test('should throw an error when password is too short', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: '12345',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toThrowError(/Password must be at least 6 characters/);
  });

  test('should throw an error when name is too long', async () => {
    const userData = {
      name: 'A'.repeat(51),
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toThrowError(/Name must have a maximum of 50 characters/);
  });

  test('should save a user with minimal required fields', async () => {
    const userData = {
      name: 'Minimal User',
      email: 'minimaluser@example.com',
      password: 'minimalpassword',
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(userData.name);
    expect(foundUser.email).toBe(userData.email);
    expect(foundUser.address1).toBe('');
    expect(foundUser.city).toBe('');
    expect(foundUser.state).toBe('');
    expect(foundUser.zipcode).toBe('');
  });

  const originalBcryptHash = bcrypt.hash;

  test('should throw an error when bcrypt.hash fails', async () => {
    bcrypt.hash = jest.fn((_, __, callback) => {
      callback(new Error('Bcrypt hashing failed'), null);
    });

    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    const user = new User(userData);
    await expect(user.save()).rejects.toThrowError(/Bcrypt hashing failed/);

    // Restore the original bcrypt.hash function after the test
    bcrypt.hash = originalBcryptHash;
  });

});
