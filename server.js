const express = require('express');
const morgan = require('morgan');

const axios = require('axios');
const querystring = require('querystring');

const sse = require('./sse');

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));

app.listen(port, () => console.log(`Listening on port ${port}`));

var tokens = null;

app.use(sse);

// Clio auth endpoint
app.get('/auth', (req, res) => {
  if (req.query.code) {
    console.log("Making request...");
    tokens = getAccessToken(req.query.code);
  } else {
    console.log("Error: no authorization code");
    return res.send("Error: no authorization code");
  };
});

app.get('/refresh_matters', (req, res) => {
  if (tokens.authToken) {
    //refresh matters data
  } else {
    return res.send("Error: no authorization token");
  }
});

app.get('/auth_stream', (req, res) => {
  if (tokens) {
    res.sseSetup();
    res.sseSend(tokens);
    tokens = null;
  } else {
    return res.send("Error: no authorization token");
  }
});

// Once we have an authorization code, we need to POST to Clio to receive access & refresh tokens
function getAccessToken(accessCode) {
  const requestBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: accessCode,
    redirect_uri: "https://clio-multi-timer-server.herokuapp.com/auth"
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  axios.post('https://app.clio.com/oauth/token', querystring.stringify(requestBody), config)
    .then((res) => {
      var authToken = res.data.access_token;
      var refreshToken = res.data.refresh_token;
    })
    .catch((error) => {
      console.error(error)
    });

  // TODO: add expiresIn, check whether we need to use refresh token
  return {
    authToken: authToken,
    refreshToken: refreshToken
  }
}