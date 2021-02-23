import { Schema, model } from 'mongoose';
import bcryptPlugin from 'mongoose-bcrypt';

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, required: true , unique: true},
  token: { type: String, required:false },
  twitter_token: { type: String, required:false },
  twitter_secret: { type: String, required:false }
});

userSchema.plugin(bcryptPlugin);

export const User = model('User', userSchema);
