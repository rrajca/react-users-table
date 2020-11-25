const express = require("express");
const axios = require("axios");
const https = require("https");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);

/*
    Example of simple request
    fetch(`/api/greeting?name={name}`)
        .then(response => response.json())
        .then(state => console.log(state));

*/

// settings for jovian rest
const username = "admin";
const password = "admin";

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

// get users
app.get("/api/users", (req, res) => {
  const page = req.query.page;
  const per_page = req.query.per_page;
  const search = req.query.search;
  const sort_by = req.query.sort_by;
  const order = req.query.order;

  res.setHeader("Content-Type", "application/json");
  const url = "https://192.168.176.143:82/api/v4/users";

  instance
    .get(url, {
      params: {
        page,
        per_page,
        ...(search ? { search } : {}),
        ...(sort_by ? { sort_by } : {}),
        ...(order ? { order } : {}),
      },
      headers: {
        Authorization: `Basic ${token}`,
      },
    })
    .then(function (response) {
      console.log(response);
      res.send(JSON.stringify(response.data));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ users: [] }));
    });
});

// add user
app.post("/api/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const url = "https://192.168.176.143:82/api/v4/users";

  axios({
    method: "post",
    url: url,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      Authorization: `Basic ${token}`,
    },
    data: {
      name: req.body.name,
      password: req.body.password,
      backend_name: "LDAP",
    },
  })
    .then(function (response) {
      res.send(JSON.stringify(response));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify(err));
    });
});

// delete user
app.delete("/api/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const url = "https://192.168.176.143:82/api/v4/users/";
  const user = req.query.user;
  const userUrl = url.concat(user);

  axios({
    method: "delete",
    url: userUrl,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      Authorization: `Basic ${token}`,
    },
  })
    .then(function (response) {
      res.send(JSON.stringify(response));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify(err));
    });
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
