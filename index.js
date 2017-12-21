const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');
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

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});