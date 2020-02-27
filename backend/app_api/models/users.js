import { Mongoose } from "mongoose";
const jwt = require('jsonwebtoken');

var userSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

userSchema.methods.validPassword = password => {
  //validate password here
  console.log(password);
}

userSchema.methods.generateJwt = () => {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'applesauce');
}