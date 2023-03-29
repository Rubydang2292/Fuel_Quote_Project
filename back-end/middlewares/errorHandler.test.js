const { errorHandler } = require('../middlewares/errorHandler');

describe('errorHandler middleware', () => {
  const req = {};
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('should handle a generic error', () => {
    const err = new Error('Test error');
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'Test error' });
  });

  it('should handle a duplicate key error', () => {
    const err = {
      code: 11000,
      keyValue: { email: 'test@example.com' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ status: 'fail', message: 'email has been used already' });
  });

  it('should handle a validation error', () => {
    const err = {
      errors: {
        email: { properties: { message: 'Email is required' } },
        password: { properties: { message: 'Password is required' } },
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: ['Email is required', 'Password is required'],
    });
  });

  it('should handle an ObjectId error', () => {
    const err = {
      kind: 'ObjectId',
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    req.originalUrl = '/api/test/invalid_id';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'The /api/test/invalid_id is not found because of wrong ID',
    });
  });
});
