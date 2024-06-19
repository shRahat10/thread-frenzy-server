const jwt = require('jsonwebtoken');

const verifyToken = (role) => {
    return (req, res, next) => {
        const token = req.cookies.jwt;
        // console.log("verify token: ", token);

        if (!token) {
            return res.status(401).send({ message: 'Unauthorized access' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized access' });
            }
            req.user = decoded;
            if (role && role !== decoded.role) {
                return res.status(403).send({ message: 'Unauthorized access' });
            }
            next();
        });
    }
}

module.exports = verifyToken;