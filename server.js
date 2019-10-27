const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));

app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/callback', (req, res) => {
  console.log("Hello world!");
  console.log(req.params);
  res.send(200);
});