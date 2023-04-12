const authController = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');

describe('authController', () => {
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
});