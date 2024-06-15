const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token exists and is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
            } else {
                // console.log(decodedToken);
                req.userId = decodedToken.id;
                // console.log(req.userId);
                next();
                
            }
        });
    } else {
        res.redirect('/');
    }
}





module.exports = { requireAuth};