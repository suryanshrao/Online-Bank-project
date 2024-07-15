const express = require('express');
const zod = require("zod")
const {User} = require("../db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config")
const router = express.Router();

// SIGNUP ROUTER
const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstname : zod.string(),
    lastname : zod.string()
})

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

    const user = User.findOne({
        username : body.username
    })

    if(user._id){ // this means user with username is already in the db
        return res.json({
            message : "Username already taken."
        })
    }

    // Saving the user data in DB
    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId : dbUser._id
    }, JWT_SECRET);

    res.json({
        message : "User created successfully",
        token : token
    })

})

module.exports = router;