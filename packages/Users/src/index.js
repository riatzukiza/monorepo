import express from 'express';
import bodyParser from 'body-parser';

import {
  authenticateToken,
  signup,
  login,
  logout,
  authCheck
} from './controllers/index.js';

const app = express();

const api = express.Router();
const auth = express.Router();
// const tw = express.Router();
// tw.get("/sign-in", signInWithTwitter);
// tw.get("/request-token",getTwitterRequestToken);
// api.use("/tw",tw);

app.use(express.static('./static'));

auth.use("/authCheck",authCheck)

auth.post("/login",login);
auth.post("/logout",logout);
auth.post("/signup",signup);

api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use("/auth",auth);

app.use('/api/v1',api);


app.listen(8082,() => console.log(" listening on 8082"))

