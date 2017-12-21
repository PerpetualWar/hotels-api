const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');
const { Hotel } = require('./models/hotel');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

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

app.get('/hotel_api', async (req, res) => {
  try {
    const doc = await Hotel.find({});
    res.send(doc)
  } catch (e) {
    res.status(400).send(e)
  }
});

app.get('/hotel_api/:id', async (req, res) => {
  console.log(req.params)
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ message: 'Item with that ID does not exist' });
  }

  try {
    const doc = await Hotel.findById(id);
    res.send(doc)
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/hotel_api/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ message: 'Item with that ID does not exist' });
  }

  try {
    const doc = await Hotel.findByIdAndRemove(id);
    if (!doc)
      return res.status(404).send('doesnt exist')
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});