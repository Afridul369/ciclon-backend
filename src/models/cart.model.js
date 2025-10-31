const mongoose = require("mongoose");
const { Schema } = mongoose;

// Cart Schema
const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
      trim: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          default : null
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          default : null
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: 1,
        },
        unitTotalPrice: {
          type: Number,
          required: [true, "Total price is required"],
          min: 0,
        },
        size: {
          type: String,
          trim: true,
          required: true,
        },
        color: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default:null
    },
    totalproduct: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType :{
        type : String
    },
    totalAmountOfWholeProduct: {
      type: Number,
      required : false,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
