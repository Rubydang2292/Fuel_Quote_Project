// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// // const User = require('./User');

// // describe('User model', () => {
// //   beforeAll(async () => {
// //     await mongoose.connect(global.__MONGO_URI__, {
// //       useNewUrlParser: true,
// //       useCreateIndex: true,
// //       useUnifiedTopology: true,
// //     });
// //   });

// //   afterAll(async () => {
// //     await mongoose.connection.close();
// //   });

// //   test('should save a user with hashed password', async () => {
// //     const userData = {
// //       name: 'Test User',
// //       email: 'testuser@example.com',
// //       password: 'testpassword',
// //       address1: '123 Test St',
// //       city: 'Test City',
// //       state: 'TS',
// //       zipcode: 12345,
// //       isAdmin: 'false',
// //     };

// //     const user = new User(userData);
// //     await user.save();

// //     const foundUser = await User.findOne({ email: userData.email });

// //     expect(foundUser).toBeDefined();
// //     expect(foundUser.name).toBe(userData.name);
// //     expect(foundUser.email).toBe(userData.email);
// //     expect(foundUser.password).not.toBe(userData.password);
// //     expect(bcrypt.compareSync(userData.password, foundUser.password)).toBe(true);
// //   });

// //   test('should throw an error when required fields are missing', async () => {
// //     const userData = {
// //       password: 'testpassword',
// //     };

// //     const user = new User(userData);
// //     await expect(user.save()).rejects.toThrowError();
// //   });
// // });


// const mongoose = require('mongoose');
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// describe('User model', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     });
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   afterEach(async () => {
//     await User.deleteMany({});
//   });

//   it('should create a new user', async () => {
//     const user = new User({
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       password: 'password',
//       address1: '123 Main St',
//       city: 'Anytown',
//       state: 'CA',
//       zipcode: 12345,
//       isAdmin: false,
//     });
//     const savedUser = await user.save();
//     expect(savedUser._id).toBeDefined();
//     expect(savedUser.name).toBe('John Doe');
//     expect(savedUser.email).toBe('john.doe@example.com');
//     expect(savedUser.address1).toBe('123 Main St');
//     expect(savedUser.city).toBe('Anytown');
//     expect(savedUser.state).toBe('CA');
//     expect(savedUser.zipcode).toBe(12345);
//     expect(savedUser.isAdmin).toBe(false);
//     const isMatch = await bcrypt.compare('password', savedUser.password);
//     expect(isMatch).toBe(true);
//   });

//   it('should hash password before saving', async () => {
//     const user = new User({
//       name: 'Jane Smith',
//       email: 'jane.smith@example.com',
//       password: 'password',
//     });
//     await user.save();
//     const savedUser = await User.findOne({ email: 'jane.smith@example.com' });
//     expect(savedUser.password).not.toBe('password');
//     const isMatch = await bcrypt.compare('password', savedUser.password);
//     expect(isMatch).toBe(true);
//   });

//   it('should require name, email, and password', async () => {
//     const user = new User();
//     await expect(user.save()).rejects.toThrow();
//     await expect(user.save()).rejects.toThrow(/Name must be required/);
//     await expect(user.save()).rejects.toThrow(/Email must be required/);
//     await expect(user.save()).rejects.toThrow(/Password must be required/);
//   });

//   it('should require password to be at least 6 characters', async () => {
//     const user = new User({
//       name: 'Bob Johnson',
//       email: 'bob.johnson@example.com',
//       password: 'pass',
//     });
//     await expect(user.save()).rejects.toThrow(/Password must be at least 6 characters/);
//   });

//   it('should enforce unique name and email', async () => {
//     const user1 = new User({
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       password: 'password',
//     });
//     await user1.save();
//     const user2 = new User({
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       password: 'password',
//     });
//     await expect(user2.save()).rejects.toThrow(/duplicate key/);
//   });
// });


require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./User');

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost/test', {
      useNewUrlParser: true,
      useCreateIndex: true,
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
