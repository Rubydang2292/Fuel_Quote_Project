const jwt = require('jsonwebtoken');

exports.checkCurrentUser = (req, res, next) => {

    const Authorization = req.header("Authorization");

    if (!Authorization) {
        // error

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
}
