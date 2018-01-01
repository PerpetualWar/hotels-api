const mongoose = require('mongoose');

const Favorites = mongoose.model('Favorites', {
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // hotel_id: {
  //   type: String,
  //   required: true,
  //   minlength: 1,
  //   trim: true
  // },
  is_favorite: {
    type: Boolean,
    required: true
  },
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { Favorites };