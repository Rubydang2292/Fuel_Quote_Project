const jwt = require('jsonwebtoken');
const { checkCurrentUser } = require('../middlewares/checkCurrentUser');

describe('checkCurrentUser middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('should set req.user to null and call next if Authorization header is missing', () => {
    const req = {
      header: () => null,
    };

    checkCurrentUser(req, {}, next);

    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to valid userId and call next with valid token', () => {
    const userId = '12345';
    const token = jwt.sign({ userId }, process.env.APP_SECRET);

    const req = {
      header: () => `Bearer ${token}`,
    };

    checkCurrentUser(req, {}, next);

    expect(req.user).toEqual({ userId });
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user to null and call next with invalid token', () => {
    const req = {
      header: () => 'Bearer invalid_token',
    };

    checkCurrentUser(req, {}, next);

    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });
});
