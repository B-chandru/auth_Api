const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes/auth");
const postrouter = require('./routes/posts')

dotenv.config();

 // connecting with mongodb database
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true} , (err)=>{
    console.log("DB connected...")
    if(err) {console.log("DB not connected")}
});

// middleware
app.use(express.json());


app.use("/app", routes);
app.use("/app/posts", postrouter)



app.listen(5000,()=>{
    console.log("server running on 5000..")
})
