import express from 'express';

import {
  getTwitterRequestToken,
  signInWithTwitter,
  authenticateToken,
  signup,
  login,
  logout
} from './controllers';

const app = express();

const api = express.Router();
const auth = express.Router();
// const tw = express.Router();
// tw.get("/sign-in", signInWithTwitter);
// tw.get("/request-token",getTwitterRequestToken);
// api.use("/tw",tw);


auth.post("/login",login);
auth.post("/logout",logout);
auth.post("/signup",signup);


api.use("/auth",auth);

api.use(authenticateToken);
app.get('/api/v1',api);

