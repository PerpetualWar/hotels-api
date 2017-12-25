const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Hotel } = require('./models/hotel');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const { asyncErrorHandler } = require('./middleware/errorHandler');

const app = express();
const port = 8080;

//middlewares
app.disable('x-powered-by');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// add new hotel
app.post('/hotel_api', async (req, res) => {
  console.log(req.body)
  const hotel = new Hotel({
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    country: req.body.country,
    stars: req.body.stars,
    price: req.body.price
  });

  try {
    const doc = await hotel.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e)
  }
});

//get all hotels
app.get('/hotel_api', async (req, res) => {
  try {
    const doc = await Hotel.find();
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
});

// get specific hotel based on id
app.get('/hotel_api/:id', async (req, res) => {
  const id = req.params.id;

  // if (!ObjectID.isValid(id)) {
  //   return res.status(404).send({ message: 'Item with that ID does not exist' });
  // }
  // Hotel.findById(id).then(doc => {
  //   res.send(doc);
  // }).catch(e => res.status(400).send(e));
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
app.delete('/hotel_api/:id', async (req, res) => {
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

app.post('/register', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  console.log(body);
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

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
  // debugger
//   req.user.removeToken(req.token).then(() => {
//     rest.status(200).send();
//   }).catch((e) => {
//     console.log(e)
//     res.status(400).send();
//   });
});

app.use(function (error, req, res, next) {
  // Gets called because of `asyncErrorHandler()` middleware
  res.json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});