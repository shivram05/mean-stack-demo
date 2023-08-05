const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const app = express();
mongoose
  .connect(
    "mongodb+srv://shivram:MWYEJm6dM9vXWXSB@cluster0.nvtrsxv.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connection Successfully");
  })
  .catch((e) => {
    console.log("Connection failed" + e.message);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/posts", postsRoutes);
app.use("/images", express.static(path.join("backend/images")));

module.exports = app;
