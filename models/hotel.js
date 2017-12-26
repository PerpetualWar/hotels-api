const mongoose = require('mongoose');
const _ = require('lodash');

const HotelSchema = new mongoose.Schema({
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
  }
});

HotelSchema.methods.toJSON = function () {
  const hotelObject = this.toObject();
  return _.pick(hotelObject, ['_id', 'name', 'description', 'city', 'country', 'stars', 'price']);
};

const Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = { Hotel };