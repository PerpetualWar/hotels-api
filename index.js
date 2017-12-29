require('./config/config');

const express = require('express');
const cors = require('cors');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Hotel } = require('./models/hotel');
const { User } = require('./models/user');
const { Favorites } = require('./models/favorites');
const { authenticate } = require('./middleware/authenticate');
const { asyncErrorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT;

//middlewares
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// add new hotel
app.post('/hotel_api', authenticate, async (req, res) => {
  console.log(req.body)
  const hotel = new Hotel({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    country: req.body.country,
    stars: req.body.stars,
    price: req.body.price,
    reviews: req.body.reviews
  });

  try {
    const hotelName = await Hotel.findOne({ name: req.body.name });
    if (hotelName)
      return res.status(400).send({ message: 'Hotel with that name already exist' });
    const doc = await hotel.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e)
  }
});

//get all hotels
app.get('/hotel_api', authenticate, async (req, res) => {
  try {
    const doc = await Hotel.find();
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
});

// get specific hotel based on id
app.get('/hotel_api/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  // if (!ObjectID.isValid(id)) {
  //   return res.status(404).send({ message: 'Item with that ID does not exist' });
  // }
  try {
    const doc = await Hotel.findById(id);
    if (!doc)
      return res.status(404).send({ message: 'Item with that ID does not exist' })
    res.send(doc)
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete specific hotel
app.delete('/hotel_api/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Hotel.findByIdAndRemove(id);
    if (!doc)
      return res.status(404).send({ message: 'Item with that ID does not exist' })
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

// get hotel reviews
app.get('/hotel_api/get_hotel_reviews/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Hotel.findById(id);
    if (!doc)
      return res.status(404).send({ message: 'Item with that ID does not exist' });
    console.log(doc);
    res.send(doc.reviews);
  } catch (e) {
    res.status(400).send(e);
  }

});

//register new user
app.post('/register', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);
  try {
    const savedUser = await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(savedUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/api-token-auth', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/favorites/add_remove', authenticate, async (req, res) => {
  // console.log(req.body)
  const favorites = new Favorites({
    hotel_id: req.body.hotel_id,
    is_favorite: req.body.is_favorite,
    _userid: req.user._id
  });
  try {
    if (req.body.is_favorite === 'true') {
      // add to db
      const hotel = await Favorites.findOne({ hotel_id: req.body.hotel_id });
      if (hotel)
        return res.status(400).send({ message: 'hotel already added' });
      const doc = await favorites.save();
      res.send(doc);

    } else if (req.body.is_favorite === 'false') {
      // delete from db
      const hotel = await Favorites.findOne({ hotel_id: req.body.hotel_id });
      if (!hotel)
        return res.status(400).send({ message: 'hotel does not exist' });
      const doc = await Favorites.remove({ hotel_id: req.body.hotel_id });
      res.send(doc);

    }
  } catch (e) {
    res.status(400).send('from catch')
  }
});

app.get('/favorites', authenticate, async (req, res) => {
  try {
    const doc = await Favorites.find({
      _userid: req.user._id
    });
    res.send(doc);
  } catch (e) {
    res.status(400).send();
  }
});

// Gets called because of `asyncErrorHandler()` middleware
app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = { app }