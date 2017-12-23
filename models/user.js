const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () { //adding custom method to instances of models
  const access = 'auth';
  const token = jwt.sign({ _id: this._id.toHexString(), access }, 'bleh').toString();

  this.tokens.push({ access, token });

  await this.save();
  return token;
};

UserSchema.statics.findByToken = async function (token) { // adding custom model method by statics
  let decoded;

  try {
    decoded = jwt.verify(token, 'bleh');
  } catch (e) {
    // return new Promise((resolve, reject) => { //valid promise call
    //   reject();
    // })
    return Promise.reject(); // shorthand for the above
  }
  return await User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function (next) {  //hashing the password in mongoose middleware before saving to the db
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User }