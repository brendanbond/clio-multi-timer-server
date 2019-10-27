const express = require('express');
const morgan = require('morgan');

const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));

app.listen(port, () => console.log(`Listening on port ${port}`));

var authToken = "";
var refreshToken = "";

function makeRequest(accessCode) {
  axios.post('https://app.clio.com/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: accessCode,
      redirect_uri: "https://clio-multi-timer-server.herokuapp.com/callback"
    }).then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      authToken = res.query.access_token;
      refreshToken = res.query.refresh_token;
    })
    .catch((error) => {
      console.error(error)
    });
}
// Clio redirects to here
app.get('/callback', (req, res) => {
  if (req.query.code) {
    console.log("Making request...");
    makeRequest(req.query.code);
  } else {
    console.log("Error: code not granted");
  }

  res.send(200);
});