const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please provide  Fullname'],
    minlength: 3,
    maxlength: 50,
  },
  gender: {
    type: String,
    required: [true, 'Please provide  Gender'],
    minlength: 6,
    maxlength: 10,
  },
   email: {
    type: String,
    unique: true,
    required: [true, 'Please provide Email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid Email',
  },
  phone_no: {
    type: Number,
    required: [true, 'Please provide Phone Number'],
    minlength: 11,
    maxlength: 14,
  },
   country: {
    type: String,
    required: [true, 'Please provide  Country'],
    minlength: 20,
    maxlength: 70,
  },
  adress: {
    type: String,
    required: [true, 'Please provide  Address'],
    minlength: 50,
    maxlength: 500,
  },
  postal_code: {
    type: Number,
    required: [true, 'Please provide  Postal Code'],
    minlength: 6,
    maxlength: 6,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// The code in the UserScheme.pre() function is called a pre-hook.
// Before the user information is saved in the database, this function will be called,
// you will get the plain text password, hash it, and store it.
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
