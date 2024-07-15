const express = require('express');
const zod = require("zod")
const {User} = require("../db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const router = express.Router();

// SIGNUP Schema
const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()
})

// SIGNUP Router
router.post("/signup", async(req,res) => {
    const body = req.body;

    // Checking whether user is sending the right inputs/username already exists
    const {success} = signupSchema.safeParse(req.body);

    // If the {success} is false
    if(!success){
        return res.json({
            message : "Username already taken / Incorrect Input"
        })
    }

    const userexists = User.findOne({
        username : body.username
    })

    if(userexists._id){ // if true => this means user with username is already in the db
        return res.json({
            message : "Username already taken."
        })
    }

    // Saving the user data in DB
    const user = await User.create(body);

    const token = jwt.sign({
        userId : user._id
    }, JWT_SECRET);

    res.json({
        message : "User created successfully",
        token : token
    })

})

// SIGNIN Schema 
const signinSchema = zod.object({
    username : zod.string(),
    password : zod.string()
})

// SINGIN Router
router.post("/signin", async(req,res) =>{
    const {success} = signinSchema.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message : "Incorrect Inputs"
        })
    };

    // checking if the userexists in the database.
    const user = await User.findOne({ 
        username : req.body.username,
        password : req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET);

        res.json({
            token : token
        })
        return;
    }

    // If (user) is false
    res.status(411).json({
        message : "No Such User Exists"
    })
})

module.exports = router;


// WHAT DOES/MEAN WHAT
// `const express = require('express'); // Import the Express library.
// `const zod = require("zod") // Import the Zod library for schema validation.
// `const {User} = require("../db") // Import the User model from the database module.
// `const jwt = require("jsonwebtoken") // Import the jsonwebtoken library for token handling.
// `const JWT_SECRET = require("../config") // Import the JWT secret key from the config file.
// `const router = express.Router(); // Create a new Express router instance.
// `// SIGNUP Schema
// `const signupSchema = zod.object({ // Define a Zod schema for signup validation.
// ` username : zod.string(), // Username must be a string.
// ` password : zod.string(), // Password must be a string.
// ` firstname : zod.string(), // First name must be a string.
// ` lastname : zod.string() // Last name must be a string.
// `})
// `// SIGNUP Router
// `router.post("/signup", async(req,res) => { // Define a POST route for signup.
// ` const body = req.body; // Extract the request body.
// ` // Checking whether user is sending the right inputs/username already exist
// ` const {success} = signupSchema.safeParse(req.body); // Validate the request body against the schema.
// ` // If the {success} is false
// ` if(!success){ // Check if validation failed.
// ` return res.json({ // Return an error message if validation failed.
// ` message : "Username already taken / Incorrect Input"
// ` })
// ` }
// ` const userexists = User.findOne({ // Check if a user with the given username already exists.
// ` username : body.username
// ` })
// ` if(userexists._id){ // if true => this means user with username is already in the db
// ` return res.json({ // Return an error message if the username is already taken.
// ` message : "Username already taken."
// ` })
// ` }
// ` // Saving the user data in DB
// ` const user = await User.create(body); // Create a new user in the database.
// ` const token = jwt.sign({ // Generate a JWT token for the new user.
// ` userId : user._id
// ` }, JWT_SECRET);
// ` res.json({ // Return a success message and the token.
// ` message : "User created successfully",
// ` token : token
// ` })
// `})
// `// SIGNIN Schema
// `const signinSchema = zod.object({ // Define a Zod schema for signin validation.
// ` username : zod.string(), // Username must be a string.
// ` password : zod.string() // Password must be a string.
// `})
// `// SINGIN Router
// `router.post("/signin", async(req,res) =>{ // Define a POST route for signin.
// ` const {success} = signinSchema.safeParse(req.body) // Validate the request body against the schema.
// ` if(!success){ // Check if validation failed.
// ` return res.status(411).json({ // Return an error message if validation failed.
// ` message : "Incorrect Inputs"
// ` })
// ` };
// ` // checking if the userexists in the database.
// ` const user = await User.findOne({ // Find a user with the given username and password.
// ` username : req.body.username,
// ` password : req.body.password
// ` });
// ` if(user){ // Check if the user exists.
// ` const token = jwt.sign({ // Generate a JWT token for the user.
// ` userId : user._id
// ` }, JWT_SECRET);
// ` res.json({ // Return the token.
// ` token : token
// ` })
// ` return;
// ` }
// ` // If (user) is false
// ` res.status(411).json({ // Return an error message if the user does not exist.
// ` message : "No Such User Exists"
// ` })
// `})
// `module.exports = router; // Export the router module.