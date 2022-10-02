const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: [
      6,
      `The name must contains at least 6 characters , got ${VALUE}`,
    ],
    maxLength: [
      6,
      `The name can't contains more than 15 characters , got ${VALUE}`,
    ],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "This email already exists , please provide another email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    match: [
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      "Please provide a valid password",
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);
