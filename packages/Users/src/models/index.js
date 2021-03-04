import mongoose from 'mongoose';
import bcryptPlugin from 'mongoose-bcrypt';

import dotenv from 'dotenv';


const {Schema, model} = mongoose;

dotenv.config();

(async () => {
  try {
    await mongoose.connect("mongodb://localhost", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected');
  } catch (err) {
    console.error(`Error ${err.message}`);
  }
})();




const userSchema = new Schema({
  email: { type: String, required: true , unique: true},
  token: { type: String, required:false },
  twitter_token: { type: String, required:false },
  twitter_secret: { type: String, required:false }
});

userSchema.plugin(bcryptPlugin);

export const User = model('User', userSchema);
