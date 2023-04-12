// adjust for unit tests
// module.exports = (req, res, next) => {
//     if (!req.headers.authorization) {
//       req.user = null;
//       return next();
//     }
    // end adjust for unit tests


    const jwt = require('jsonwebtoken');

    exports.checkCurrentUser = (req, res, next) => {
      const Authorization = req.header("Authorization");
    
      if (!Authorization) {
        req.user = null;
        next();
      } else {
        const token = Authorization.replace('Bearer ', "");
    
        // Verify token
        try {
          const { userId } = jwt.verify(token, process.env.APP_SECRET);
          req.user = { userId };
          next();
        } catch (err) {
          req.user = null;
          next();
        }
      }
    };
    
