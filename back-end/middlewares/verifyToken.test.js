const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/verifyToken');

describe('verifyToken middleware', () => {
  const req = {
    header: jest.fn(),
  };
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req.header.mockClear();
    next.mockClear();
  });

  it('should return an error if the Authorization header is missing', () => {
    req.header.mockReturnValue(null);

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('Unauthorized');
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it('should verify a valid token and attach the user ID to the request', () => {
    const token = jwt.sign({ userId: 'testUserId' }, process.env.APP_SECRET);
    req.header.mockReturnValue(`Bearer ${token}`);

    verifyToken(req, res, next);

    expect(req.user).toEqual({ userId: 'testUserId' });
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeUndefined();
  });

  it('should return an error if the token is invalid', () => {
    req.header.mockReturnValue('Bearer invalid_token');

    expect(() => verifyToken(req, res, next)).toThrow();

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/invalid token/);
  });
});
