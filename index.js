const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('root endpoint working');
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});