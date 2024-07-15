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