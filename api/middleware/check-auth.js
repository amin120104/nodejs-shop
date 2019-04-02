const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        var decoded = jwt.verify(token, process.env.JWT_KEY);
        next();
      } catch(err) {
            return res.status(401).json({
                message: "auth failed",
                error: err
            })
      }      
}