// setup lib
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// template engine ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Models */
const Product = require("./models/product");

// connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/shop_db")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error(err);
  });

// route web path
app.get("/", (req, res) => {
  res.send("Hello World");
});

// all products
app.get("/products", async (req, res) => {
  // query
  const products = await Product.find({});
  res.render("products/index", { products });
});

// form tambah data product
app.get("/products/create", (req, res) => {
  res.render("products/create");
});

// detail product
app.get("/products/:id", async (req, res) => {
  // query
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

// port
app.listen(3000, () => {
  console.log("shop app listening on http://127.0.0.1:3000");
});
