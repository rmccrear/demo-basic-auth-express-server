"use strict";
require("dotenv").config();

// 3rd Party Resources
const express = require("express");
const bcrypt = require("bcrypt");
const base64 = require("base-64");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db");
const Users = require("./models/user");

const authenticate = require("./middleware/authenticate");

// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());

// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
app.post("/signup", async (req, res) => {
  try {
    // req.body.password = await bcrypt.hash(req.body.password, 10); //?
    const record = await Users.create(req.body);
    res.status(200).json(record);
  } catch (e) {
    res.status(403).send("Error Creating User");
  }
});

// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
app.post("/signin", authenticate, async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

app.get("/signin", authenticate, async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

app.use((err, req, res, next) => {
  if (err === "Invalid User" || err == "Invalid Password") {
    res.status(403).send("Invalid Login");
  }
});

module.exports = app;
