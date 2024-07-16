const express = require('express');
const zod = require("zod")
const {User, Account} = require("../db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { authMiddleware } = require('../middleware');
const router = express.Router();

// SIGNUP Schema
const signupSchema = zod.object({
    username : zod.string().email(),
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()
})

// SIGNUP Router
router.post("/signup", async(req,res) => {
    const body = req.body;

    // Checking whether user is sending the right inputs/username already exists
    const parsed = signupSchema.safeParse(req.body);

    // If the {success} is false
    if(!parsed.success){
        return res.json({
            message : "Username already taken / Incorrect Input"
        })
    }

    const userexists = await User.findOne({
        username : body.username
    })

    if(userexists._id){ // if true => this means user with username is already in the db
        return res.json({
            message : "Username already taken."
        })
    }

    // Saving the user data in DB
    const user = await User.create(body);

    await Account.create({
        user,
        balance : 1 + Math.random() * 10000
    })

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

const updateBody = zod.object({
    password : zod.string().optional(),
    firstname : zod.string().optional(),
    lastname : zod.string().optional(),

})

router.put("/", authMiddleware, async(req, res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message : "Error while updating information."
        })
    }

    await User.updateOne(req.body, {
        id : req.userId
    })

    res.json({
        message : "!! Updated Successfully !!"
    })
})

router.get("/bulk", async(req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            firstName : {
                "$regex" : filter
            }
        }, {
            lastName : {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
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




// Define a Zod schema for update request body with optional fields.
// const updateBody = zod.object({
//     password : zod.string().optional(), // Optional `password` field of type string.
//     firstname : zod.string().optional(), // Optional `firstname` field of type string.
//     lastname : zod.string().optional(), // Optional `lastname` field of type string.
// });
// // Define a PUT route handler with authentication middleware for updating user information.
// router.put("/", authMiddleware, async(req, res) => {
//     // Validate the request body against the `updateBody` schema.
//     const {success} = updateBody.safeParse(req.body);
//     if(!success){
//         // Respond with a 411 status and error message if validation fails.
//         res.status(411).json({
//             message : "Error while updating information."
//         });
//     }
//     // Update the user information in the database based on `req.body`.
//     await User.updateOne(req.body, {
//         id : req.userId // Update the user based on `userId` from authentication middleware.
//     });
//     // Respond with a success message after updating successfully.
//     res.json({
//         message : "!! Updated Successfully !!"
//     });
// });



// Define a GET route handler for the path `/bulk`.
// router.get("/bulk", async(req,res) => {
//     // Get the `filter` query parameter from the request, defaulting to an empty string if not provided.
//     const filter = req.query.filter || "";
//     // Find users in the `User` collection that match the filter.
//     const users = await User.find({
//         // Use the `$or` operator to specify multiple conditions.
//         $or : [{
//             // Specify the first condition: `firstName` field.
//             firstName : {
//                 "$regex" : filter // Use a regular expression to match the `firstName` against the filter.
//             }
//         }, {
//             // Specify the second condition: `lastName` field.
//             lastName : {
//                 "$regex" : filter // Use a regular expression to match the `lastName` against the filter.
//             }
//         }]
//     });
//     // Send a JSON response to the client.
//     res.json({
//         // Map the `users` array to a new array with selected fields.
//         user : users.map(user => ({
//             username : user.username, // Include the `username` field in the response.
//             firstName : user.firstName, // Include the `firstName` field in the response.
//             lastName : user.lastName, // Include the `lastName` field in the response.
//             _id : user._id // Include the `_id` field in the response.
//         }))
//     });
// });


// `module.exports = router; // Export the router module.