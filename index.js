const express = require("express");
const { query } = require("./db.js");

var bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(bodyParser());

app.get("/", async (req, res) => {
  let result = await query("SELECT * from users");
  res.json(result.rows);
});

app.post("/users/register", async (req, res) => {
  let body = req.body;
  let users = await query("SELECT * from users");

  if (body.name && body.username && body.password && body.selectedCountry) {
    let filteredUser = users.rows.filter((user) => {
      return user.username === body.username;
    });
    if (filteredUser.length) {
      res.json({ status: "Username already exists" });
      return;
    } else {
      let token = Math.random() * 10000;
      let result = await query(
        `INSERT INTO users (name, username, password, token, country) VALUES ('${body.name}', '${body.username}','${body.password}', '${token}', '${body.selectedCountry}')`
      );
      res.json({ status: "ok", token: token, country: body.selectedCountry });
    }
  } else {
    res.json({ status: "all fields must be completed" });
  }
});

app.post("/users/login", async (req, res) => {
  let body = req.body;
  let users = await query("SELECT * from users");

  if (body.username && body.password) {
    console.log(users.rows);
    let filteredUser = users.rows.filter((user) => {
      return user.username === body.username && user.password === body.password;
    });
    console.log(filteredUser);
    console.log(filteredUser.length);
    if (filteredUser.length) {
      let token = Math.random() * 10000;
      let result = await query(
        `UPDATE users SET token=${token} WHERE username='${filteredUser[0].username}'`
      );

      res.json({
        status: "Ok",
        token: token,
        country: filteredUser[0].country,
      });
      return;
    } else {
      res.json({ status: "Invalid username or password" });
    }
  }
});

app.post("/watch-list/persist-list", async (req, res) => {
  let body = req.body;
  let users = await query("SELECT * from users");
  console.log(body.token);
  if (body.token) {
    let filteredUsers = users.rows.filter((user) => {
      console.log(body.token, user.token);

      return body.token === user.token;
    });
    console.log(filteredUsers);
    if (filteredUsers.length) {
      let result = await query(
        `INSERT INTO "watch-list" (id, movies) VALUES ('${filteredUsers[0].id}', '${body.movies}') ON CONFLICT(id) DO UPDATE SET movies = '${body.movies}'`
      );
      res.json({ status: "Ok" });
    } else {
      res.status(401).json({ status: "Please sign in to add movies" });
    }
  } else {
    res.status(401).json({ status: "Token is missing" });
  }
});

app.get("/watch-list", async (req, res) => {
  let token = req.query.token;
  let users = await query("SELECT * from users");
  if (token) {
    let filteredUsers = users.rows.filter((user) => {
      return token === user.token;
    });
    let user = filteredUsers[0];
    let watchList = await query('SELECT * from "watch-list"');
    let watchListRows = watchList.rows.filter((listItem) => {
      return listItem.id === user.id;
    });

    res.json(watchListRows[0].movies);
  } else {
    res.status(401).json({ status: "Token is missing" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
