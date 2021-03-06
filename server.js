const express = require("express");
const morgan = require("morgan");

const axios = require("axios");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://clio-multi-timer.herokuapp.com"
  ); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// Clio auth endpoint
app.get("/auth", (req, res) => {
  console.log("/auth endpoint reached.");
  if (req.query.code) {
    console.log("Auth code delivered.");
    getAuthObject(req.query.code)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  } else {
    res.sendStatus(500);
    console.log("Error: no authorization code");
  }
});

// Once we have an authorization code, we need to POST to Clio to receive access & refresh tokens
function getAuthObject(accessCode) {
  const requestBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: accessCode,
    redirect_uri: "https://clio-multi-timer.herokuapp.com/auth"
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  console.log("Retrieving access token...");

  return axios
    .post(
      "https://app.clio.com/oauth/token",
      querystring.stringify(requestBody),
      config
    )
    .then(res => {
      console.log("Promise resolved");
      return res.data;
    })
    .catch(err => {
      console.log("Promise failed to resolve...");
      throw err;
    });
}
