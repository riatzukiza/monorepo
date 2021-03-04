import { User } from '../models/index.js';
import express from 'express'
import jwt from 'jwt-promise';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("authenticating",token,authHeader)

  if (token == null) return res.sendStatus(401);

  try {
    const payload =  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '20m'});
    const user = (await User.findOne({ email:payload.email }));

    if(token !== user.token) throw Error("Tokens do not match.");
    req.user = user;
    next();

  } catch(err) { return res.sendStatus(403); }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });



  if(!user || !(await user.verifyPassword(password))) {
    console.log()
    return res.sendStatus(401,"bad password");
  }

  const token = await jwt.sign({ email:user.email } ,process.env.ACCESS_TOKEN_SECRET);
  user.token = token;
  await user.save();
  res.send({token});
}

export const logout = async (req, res, next) => {
  const {token} = req.body;
  try {
    const user = await User.findOne({token});
    user.token = null;
    await user.save();
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(404);
  }
}

export const signup = async (req, res, next) => {
  const {email, password } = req.body;
  console.log({email,password})
  try {
    await User.create({email, password});
    res.sendStatus(201);
  } catch(err) {
    console.log(err);
    res.sendStatus(401);
  }
}

export const authCheck = express().use(authenticateToken).get("/",async (req,res) => {
  res.send({success:true})
})
