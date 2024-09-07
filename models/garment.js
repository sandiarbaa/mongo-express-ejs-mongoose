const mongoose = require("mongoose");

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

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
