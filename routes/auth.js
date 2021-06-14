const route = require("express").Router()
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation , loginValidation } = require("../validate");

// for Registering a User

route.post("/register",async (req,res)=>{
 const {error} = registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message)

const emailExist = await User.findOne({email: req.body.email});
if(emailExist) return res.status(400).send('Email already exists');

const salt = await bcrypt.genSalt(10);
const hashpassword = await bcrypt.hash(req.body.password, salt);

 const user =  new User({
     name: req.body.name,
     email: req.body.email,
     password: hashpassword
 });
 try{
     const savedUser = await user.save();
     res.status(200).send({user: user._id})
 }catch(err){
     res.status(400).send(err);
 }
})

// for login

route.post("/login",async (req,res)=>{
    const {error} = loginValidation(req.body);
if(error) return res.status(400).send(error.details[0].message);

const user = await User.findOne({email: req.body.email});
if(!user) return res.status(400).send('Email or Password is wrong');

const validpassword = await bcrypt.compare(req.body.password, user.password);
if(!validpassword) return res.status(400).send("invalid password");

const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)
res.header('auth-token', token).send(token)
})


module.exports = route;