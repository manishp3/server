const mongoose = require("mongoose");

const proSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    owner:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    totalSales: {
      type: Number,
      default: 0
    },


  },
  { timestamps: true }
);

const product_tbl = mongoose.model("product", proSchema);

module.exports = product_tbl;
