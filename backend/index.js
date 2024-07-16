const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mainRouter = require("./routes/index");


app.use("/api/v1", mainRouter);

app.listen(3000 , function(){
    console.log("!! BACKEND WORKING FINE !!")
})