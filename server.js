const express = require('express');
const morgan = require('morgan');

const https = require('https');
const fs = require('fs');

const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// Clio auth endpoint
app.get('/auth', (req, res) => {
  if (req.query.code) {
    console.log("Making request...");
    return res.json(getAccessToken(req.query.code));
  } else {
    console.log("Error: no authorization code");
    return res.send("Error: no authorization code");
  };
});

// Once we have an authorization code, we need to POST to Clio to receive access & refresh tokens
function getAccessToken(accessCode) {
  var accessToken = '';
  var refreshToken = '';
  var expiresIn = 0;

  const requestBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: accessCode,
    redirect_uri: "https://localhost:3000/callback"
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  axios.post('https://app.clio.com/oauth/token', querystring.stringify(requestBody), config)
    .then((res) => {
      console.log(res.data.access_token);
      accessToken = res.data.access_token;
      refreshToken = res.data.refresh_token;
      expiresIn = res.data.expires_in;
      console.log(refreshToken);
      console.log(expiresIn);
    })
    .catch((error) => {
      console.error(error)
    });

  return {
    acccessToken: accessToken,
    refreshToken: refreshToken,
    expiresIn: expiresIn
  }
}