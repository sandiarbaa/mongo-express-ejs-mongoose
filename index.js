// setup lib
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// template engine ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // agar express dapat mengambil data yg dikirimkan dari body request

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

// tambah data product
app.post("/products", async (req, res) => {
  // query
  const product = new Product(req.body);
  await product.save();
  res.redirect(`/products/${product._id}`);
});

// detail product
app.get("/products/:id", async (req, res) => {
  // query
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

// form edit data product
app.get("/products/:id/edit", async (req, res) => {
  // query
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});

// port
app.listen(3000, () => {
  console.log("shop app listening on http://127.0.0.1:3000");
});
