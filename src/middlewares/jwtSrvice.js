const jwt  = require("jsonwebtoken");

const generateJWTToken= (req, res) => {
    // Validate User Here
    // Then generate JWT Token

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);

    return token
}

const authenticateUserWithToken= (req, res,next) => {
    // Tokens are generally passed in header of request
    // Due to security reasons.

    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    console.log(tokenHeaderKey,req.headers,"headers");
    try {
        const token = req.headers[tokenHeaderKey];

        console.log(token,"token");
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            next();
        } else {
            // Access Denied
            return res.status(401).send("Acess Denied");
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(` Access Denied.. ${error}`);
    }
}

module.exports = {generateJWTToken,authenticateUserWithToken}