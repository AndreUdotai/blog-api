


const verifyToken = (req, res, next) => {
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // GEt token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.json({
            message: "You are not allowed!"
        });
    }
}

module.exports = { verifyToken }