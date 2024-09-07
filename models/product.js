const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "nama tidak boleh kosong"],
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Baju", "Celana", "Aksesoris", "Jaket"], // isinya tidak boleh selain data ini
  },
  // ini dibuat seperti ini, karena ingin menampilkan data garment nya di dalam produknya saja
  // relasi nya ini ingin menampilkan data garment di dalam produknya saja
  // di sini 1 produk di miliki oleh 1 garment
  // beda lagi jika dengan produk yg sama tapi dimiliki oleh garment lainnya
  garment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garment",
  },
  // ini bentuk de-normalisasi
  // jadi ya semua modelnya kaya bisa saling gantian gini untuk pemanggilan query nya nanti
  // bukan berarti semua relasi harus seperti ini, tepi tergantung bagaimana mengakses kardinalitasnya
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
