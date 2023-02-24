const jwt = require('jsonwebtoken');

exports.checkCurrentUser = (req, res, next) => {

    // Access Authorization from header
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
            // Nếu không verify được token -> set user = null
            req.user = null;
            next();
        }
    }
}