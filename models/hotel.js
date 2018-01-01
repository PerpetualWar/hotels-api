const mongoose = require('mongoose');
const _ = require('lodash');

const HotelSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  city: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  country: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  stars: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  price: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  reviews: {
    type: Array,
    message: String,
    author: Object
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  }
});

HotelSchema.methods.toJSON = function () {
  const hotelObject = this.toObject();
  hotelObject.id = hotelObject._id;
  return hotelObject;
  // return _.omit(hotelObject, ['_id']);
}

const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = { Hotel };