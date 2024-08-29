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
const { wrap } = require("module");

// connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/shop_db")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error(err);
  });

function wrapAsync(fn) {
  return function (req, res, next) {
    // kalau di function ini tidak ada error, maka otomatis function ini akan bekerja
    // kalau ada error maka akan masuk di bagian catch
    fn(req, res, next).catch((err) => next(err));
  };
}

// route web path
app.get("/", (req, res) => {
  res.send("Hello World");
});

// all products
app.get("/products", async (req, res) => {
  // query
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
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
app.post(
  "/products",
  wrapAsync(async (req, res) => {
    // query
    const product = new Product(req.body);
    await product.save();
    res.redirect(`/products/${product._id}`); // redirect ke halaman show product
  })
);

// detail product
// error handling di async function
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", { product });
  })
);

// form edit data product
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res) => {
    // query
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  })
);

// edit data product
app.put(
  "/products/:id",
  wrapAsync(async (req, res) => {
    // query
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    res.redirect(`/products/${product._id}`); // redirect ke halaman show product
  })
);

// delete products
app.delete(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

// all categories
app.get(
  "/categories",
  wrapAsync(async (req, res) => {
    const categories = await Product.distinct("category"); // menampilkan ada category apa saja
    res.render("products/categories", { categories });
  })
);

// bisa juga gini buat function sendiri untuk menghandle nya
const validatorHandler = (err) => {
  err.status = 400;
  err.message = Object.values(err.errors).map((e) => e.message);
  return new ErrorHandler(err.message, err.status);
};

// 2) tambahkan middleware lagi ini, untuk memecah/mengurai error message dari si mongoose
app.use((err, req, res, next) => {
  console.dir(err);
  // ValidationError dan CastError adalah properti/method error dari si mongoose
  // cara MENGHANDLE ERROR di dalam mongoose
  // if (err.name === "ValidationError") {
  //   err.status = 400;
  //   err.message = Object.values(err.errors).map((e) => e.message);
  // }

  //mencari error di mongoose bisa dicari dengan mencari error name nya, dan untuk masing-masing kondisinya kita tentukan bagaimana cara menampilkan nya
  if (err.name === "ValidationError") err = validatorHandler(err); // re-assign value dari validatorHandler

  // ini ceritanya untuk CastError berarti datanya tidak ditemukan yg berdasarkan id itu, ini mongoose
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "Product not found";
  }
  next(err);
});

// middleware error-handling
// 1) SEBELUM DITAMPILKAN response nya di sini
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

// port
app.listen(3000, () => {
  console.log("shop app listening on http://127.0.0.1:3000");
});
