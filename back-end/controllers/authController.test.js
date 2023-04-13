const authController = require('./authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');

describe('authController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('register', () => {
    it('should create a new user and return a token', async () => {
      const req = {
        body: {
          name: 'John',
          email: 'john@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.create.mockResolvedValue({
        _id: 'user-id',
        name: 'John',
        email: 'john@example.com',
      });

      jwt.sign = jest.fn().mockReturnValue('token');

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(jwt.sign).toHaveBeenCalledWith({ userID: 'user-id' }, process.env.APP_SECRET);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Success',
        data: { token: 'token', userName: 'John' },
      });
    });

    it('should handle errors', async () => {
      const req = {
        body: {
          name: 'John',
          email: 'john@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error('Database connection error');
      User.create.mockRejectedValue(error);

      const next = jest.fn();

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should return a token and user data if email and password are correct', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        _id: 'user-id',
        name: 'John',
        email: 'john@example.com',
        password: bcrypt.hashSync('password', 10),
        address1: '123 Main St',
        address2: '',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        isAdmin: false,
      };
      User.findOne.mockResolvedValue(user);

      jwt.sign = jest.fn().mockReturnValue('token');

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(bcrypt.compareSync(req.body.password, user.password)).toBe(true);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user-id' },
        process.env.APP_SECRET
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Success',
        data: {
          token: 'token',
          userId: 'user-id',
          name: 'John',
          address1: '123 Main St',
          address2: '',
          city: 'New York',
          state: 'NY',
          zipcode: '10001',
          isAdmin: false,
        },
      });
    });

    it('should return an error if email is not correct', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      const next = jest.fn();

      await authController.login(req, res, next);

      const error = new Error('Email is not correct');
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user data', async () => {
      const req = {
        user: {
          userId: 'user-id',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        _id: 'user-id',
        name: 'John',
        email: 'john@example.com',
        address1: '123 Main St',
        address2: '',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        isAdmin: false,
      };
      User.findOne.mockResolvedValue(user);

      await authController.getCurrentUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ _id: 'user-id' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: {
            userId: 'user-id',
            address1: '123 Main St',
            address2: '',
            city: 'New York',
            state: 'NY',
            zipcode: '10001',
            name: 'John',
            isAdmin: false,
          },
        },
      });
    });
});

describe('updateCurrentUser', () => {
  it('should update the current user and return the updated profile', async () => {
    const req = {
      params: { userId: 'user-id' },
      body: {
        address1: '456 Main St',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = {
      _id: 'user-id',
      address1: '456 Main St',
      address2: '',
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
      name: 'John',
      isAdmin: false,
    };
    User.findByIdAndUpdate.mockResolvedValue(user);

    await authController.updateCurrentUser(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-id',
      { ...req.body },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { userProfile: user },
    });
  });
});


describe('getAllUser', () => {
  it('should return all users', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const users = [
      {
        _id: 'user1',
        name: 'John',
        email: 'john@example.com',
      },
      {
        _id: 'user2',
        name: 'Jane',
        email: 'jane@example.com',
      },
    ];

    User.find.mockResolvedValue(users);

    await authController.getAllUser(req, res);

    expect(User.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success',
      results: users.length,
      data: {
        userId: users._id,
        users,
      },
    });
  });
});
});