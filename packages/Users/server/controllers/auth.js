import { Users } from '../models/models';
import jwt from 'jwt-promise';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const payload =  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '20m'});
    const user = (await Users.findOne({ email:payload.email }));

    if(token !== user.token) throw Error("Tokens do not match.");
    req.user = user;
    next();

  } catch(err) { return res.sendStatus(403); }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if(!user || user.verifyPassword(password)) return res.sendStatus(401);

  const token = await jwt.sign({ email:user.email } ,process.env.ACCESS_TOKEN_SECRET);
  user.token = token;
  await user.save();
  res.send({token});
}

export const logout = async (req, res, next) => {
  const {token} = req.body;
  try {
    const user = await Users.findOne({token});
    user.token = null;
    await user.save();
    res.sendStatus(200);
  } catch(err) {
    res.sendStatus(404);
  }
}

export const signup = async (req, res, next) => {
  const {email, password } = req.body;
  try {
    await Users.create({email, password});
    res.sendStatus(201);
  } catch(err) {
    console.log(err);
    res.sendStatus(401);
  }
}
