// setup lib
const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();

const ErrorHandler = require("./ErrorHandler");

// template engine ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
  const { category } = req.query; // ambil nilai dari query string yg lewat url
  if (category) {
    // kalau query string category ada, maka cari data di dalam product berdasarkan categorynya
    const products = await Product.find({ category }); // samain aja query string yg ingin dicari dengan properti yg ada di dalam schema modelnya, kaya gini nih category semua
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({}); // tampilkan semua data
    res.render("products/index", { products, category: "All" });
  }
});

// form tambah data product
app.get("/products/create", (req, res) => {
  // throw new ErrorHandler("This is custom error", 503);
  res.render("products/create");
});

// tambah data product
app.post("/products", async (req, res) => {
  // query
  const product = new Product(req.body);
  await product.save();
  res.redirect(`/products/${product._id}`); // redirect ke halaman show product
});

// detail product
// error handling di async function
app.get("/products/:id", async (req, res, next) => {
  try {
    // query
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", { product });
  } catch (err) {
    // gunakan next supaya dia menjalankan middleware error-handling yg di bawah itu
    // karena itu kan middleware, dan next akan mengecek ada middleware lagi ngga, kalo ada ya lanjut ke situ
    next(new ErrorHandler("Product not found", 404));
  }
});

// form edit data product
app.get("/products/:id/edit", async (req, res, next) => {
  try {
    // query
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  } catch (err) {
    next(new ErrorHandler("Product not found", 404));
  }
});

// edit data product
app.put("/products/:id", async (req, res, next) => {
  try {
    // query
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`); // redirect ke halaman show product
  } catch (err) {
    next(new ErrorHandler("Failed update data", 412));
  }
});

// delete products
app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (err) {
    next(new ErrorHandler("Failed delete data", 412));
  }
});

app.get("/categories", async (req, res) => {
  const categories = await Product.distinct("category"); // menampilkan ada category apa saja
  res.render("products/categories", { categories });
});

// middleware error-handling
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

// port
app.listen(3000, () => {
  console.log("shop app listening on http://127.0.0.1:3000");
});

// error handling
// buat objek errornya dulu
// lalu lakukan proses error handling di route, gunakan next
// kalau errornya tidak ada akan pakai default user-defined middleware error-handling
// kalau ada ya pakai error yg kita definisikan
