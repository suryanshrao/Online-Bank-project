const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Online-Bank-Project")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique : true,
        trim: true,
        lowercase: true,
        minLength : 3,
        maxLength : 30 
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    firstName : {
        type : String,
        required : true,
        trim: true,
        maxLength : 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Account
};


// 1. `const mongoose = require("mongoose");`    --    Import the Mongoose library.
// 2. `mongoose.connect("mongodb://localhost:27017/Online-Bank-Project")`    --    Connect to the MongoDB database named "Online-Bank-Project".
// 3. `const userSchema = new mongoose.Schema({`    --    Define a new Mongoose schema for the user model.
// 4. `    username: {`    --          Define the `username` field in the schema.
// 5. `        type: String,`    --    Specify that the `username` is of type String.
// 6. `        required : true,`    -- Make the `username` field required.
// 7. `        unique : true,`    --   Ensure that the `username` is unique.
// 8. `        trim: true,`    --      Trim whitespace from the `username`.
// 9. `        lowercase: true,`    -- Convert the `username` to lowercase.
// 10. `        minLength : 3,`  - -        Set a minimum length of 3 characters for the `username`.
// 11. `        maxLength : 30`  - -        Set a maximum length of 30 characters for the `username`.
// 12. `    },`  - -        Close the definition for the `username` field.
// 13. `    password : {`  - -        Define the `password` field in the schema.
// 14. `        type : String,`  - -        Specify that the `password` is of type String.
// 15. `        required : true,`  - -        Make the `password` field required.
// 16. `        minLength : 6`  - -        Set a minimum length of 6 characters for the `password`.
// 17. `    },`  - -        Close the definition for the `password` field.
// 18. `    firstName : {`  - -        Define the `firstName` field in the schema.
// 19. `        type : String,`  - -        Specify that the `firstName` is of type String.
// 20. `        required : true,`  - -        Make the `firstName` field required.
// 21. `        trim: true,`  - -        Trim whitespace from the `firstName`.
// 22. `        maxLength : 50`  - -        Set a maximum length of 50 characters for the `firstName`.
// 23. `    },`  - -        Close the definition for the `firstName` field.
// 24. `    lastName: {`  - -        Define the `lastName` field in the schema.
// 25. `        type: String,`  - -        Specify that the `lastName` is of type String.
// 26. `        required: true,`  - -        Make the `lastName` field required.
// 27. `        trim: true,`  - -        Trim whitespace from the `lastName`.
// 28. `        maxLength: 50`  - -        Set a maximum length of 50 characters for the `lastName`.
// 29. `    }`  - -        Close the definition for the `lastName` field.
// 30. `});`  - -        Close the schema definition.
// 31. `const accountSchema = new mongoose.Schema({`  - -        Define a new Mongoose schema for the account model.
// 32. `    userId : {`  - -        Define the `userId` field in the schema.
// 33. `        type : mongoose.Schema.Types.ObjectId,`  - -        Specify that the `userId` is of type ObjectId.
// 34. `        ref: 'User',`  - -        Set a reference to the 'User' model.
// 35. `        required : true`  - -        Make the `userId` field required.
// 36. `    },`  - -        Close the definition for the `userId` field.
// 37. `    balance : {`  - -        Define the `balance` field in the schema.
// 38. `        type : Number,`  - -        Specify that the `balance` is of type Number.
// 39. `        required : true`  - -        Make the `balance` field required.
// 40. `    }`  - -        Close the definition for the `balance` field.
// 41. `})`  - -        Close the schema definition.
// 42. `const Account = mongoose.model('Account', accountSchema);`  - -        Create a Mongoose model for the `Account` schema.
// 43. `const User = mongoose.model('User', userSchema);`  - -        Create a Mongoose model for the `User` schema.
// 44. `module.exports = {`  - Export the models.
// 45. `    User,`  - Export the `User` model.
// 46. `    Account`   Export the `Account` model.
// 47. `};`  Close the module exports.