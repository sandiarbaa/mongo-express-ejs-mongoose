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
  // variabel untuk mendapatkan data product nya
  // buat data menggunakan model product
  // dan req.body itu akan membawa data yg di dapat dari form
  const product = new Product(req.body); // data product sudah dibuat dengan format model product
  // kalau format modelnya sudah ada berserta datanya, bisa langsung panggil method save
  // dari variabel yg menyimpan object yg berisi data productnya
  await product.save();
  // sesudah data di simpan, baru redirect ke halaman products atau detail product
  res.redirect(`/products/${product._id}`);
  // kita bisa mengakses id dari product yg baru saja di simpan
  // karena sebetulnya data dari object nya itu sudah didapatkan sebelum datanya di simpan
  // id atau properti lainnya didapatkan pada saat membuat object product yg sudah ada datanya
  // jadi bisa dimanfaatkan sesuai kebutuhan di route ini
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
