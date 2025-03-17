const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    console.log('ya samma aayo la');
    try{
        const token = req.cookies.user_session;
        if (token) {
            console.log('cookie aayo la');
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.error('Token verification failed:', err.message);
                    return res.redirect('/auth/signin');
                }
                req.user = decoded.user; // Attach user data to the request
                next();
            });
        } else {
            return res.redirect('/auth/signin');
        }
    }catch(error){
        return res.redirect('/auth/signin');
    }
};