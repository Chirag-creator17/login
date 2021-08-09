//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 = require('md5');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const userSchema = new mongoose.Schema({ email: String, password: String });

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user.password === password) {
        res.render("secrets");
      } else {
        res.render("login");
      }
    }
  });
});
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
