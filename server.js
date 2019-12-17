const express = require('express');
const morgan = require('morgan');

const axios = require('axios');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// Clio auth endpoint
app.get('/auth', (req, res) => {
  if (req.query.code) {
    const accessToken = getAccessToken(req.query.code).then((data) => {
      return data;
    }).catch((err) => {
      console.log(err);
    });
  } else {
    console.log("Error: no authorization code");
  };

  return res.send(accessToken);
});

// Once we have an authorization code, we need to POST to Clio to receive access & refresh tokens
function getAccessToken(accessCode) {
  const requestBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: accessCode,
    redirect_uri: "https://localhost:3000/auth"
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return axios.post('https://app.clio.com/oauth/token', querystring.stringify(requestBody), config);
}