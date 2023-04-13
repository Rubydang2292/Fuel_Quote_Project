const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const Authorization = req.header('Authorization');

  if (!Authorization) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }

  const token = Authorization.replace('Bearer ', '');

  try {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.user = { userId };
    next();
  } catch (err) {
    next(err);
  }
};
