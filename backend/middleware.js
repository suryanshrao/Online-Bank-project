const {JWT_SECRET} = require ("./config"); 
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch(err){
        return res.status(403).json({})
    }
};

module.exports = {
    authMiddleware
}

// WHAT DOES/MEAN WHAT
// const { JWT_SECRET } = require("./config"); // Import the JWT secret key from the config file.
// const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for token handling.

// const authMiddleware = (req, res, next) => { // Define middleware for authentication.
//     const authHeader = req.headers.authorization; // Get the authorization header from the request.

//     if (!authHeader || !authHeader.startsWith('Bearer')) { // Check if the header exists and starts with 'Bearer'.
//         return res.status(403).json({}); // Respond with 403 Forbidden if the check fails.
//     }

//     const token = authHeader.split(' ')[1]; // Extract the token from the header.

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using the secret key.
//         if (decoded.userId) { // Check if the decoded token contains a userId.
//             req.userId = decoded.userId; // Attach the userId to the request object.
//             next(); // Proceed to the next middleware or route handler.
//         } else {
//             return res.status(403).json({}); // Respond with 403 Forbidden if userId is missing.
//         }
//     } catch (err) {
//         return res.status(403).json({}); // Respond with 403 Forbidden if token verification fails.
//     }
// };
// module.exports = {
//     authMiddleware // Export the authentication middleware.
// };