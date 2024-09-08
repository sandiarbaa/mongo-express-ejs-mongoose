const mongoose = require("mongoose");
const Product = require("./product");

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tidak boleh kosong!"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Kontak tidak boleh kosong!"],
  },
  // kalau ingin melihat juga di pabrik ini ada produk apa saja
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// MIDDLEWARE DARI SCHEMA
// METHOD PRE UNTUK MENJALANKAN FUNGSI SEBELUM MENGEKSEKUSI SUATU METHOD DARI SEBUAH MODEL
// METHOD POST UNTUK MENJALANKAN FUNGSI SETELAH MENGEKSEKUSI SUATU METHOD DARI SEBUAH MODEL

// method post, itu untuk menjalankan suatu function ketika sebuah function lain itu berhasil
// method post ini dijalankan secara middleware
// jalankan method post ini setelah berhasil menjalankan findOneAndDelete
garmentSchema.post("findOneAndDelete", async function (garment) {
  // ini di parameter function adalah model/object garment nya yg menjalankan fungsi findOneAndDelete, supaya di sini bisa mengakses data si id nya
  if (garment.products.length) {
    // apakah garment yg di hapus memiliki data products?
    const res = await Product.deleteMany({ _id: { $in: garment.products } }); // kalau ada ya hapus many productsnya, berdasarkan nilai id nya
    // yg dimana nilai id nya itu sama dengan yg ada/di definisikan di dalam garment.products
    console.log(res);
  }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
