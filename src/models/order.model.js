const mongoose = require("mongoose");
const { customError } = require("../utils/customError");
const slugify = require("slugify");
const { required } = require("joi");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
      required: [true, "Brand name is required"],
    },
    guestId: {
      type: String,
      trim: true,
    },
    items: [{}],
    shippinginfo: {
      firstname: {
        type: String,
        trim: true,
        required: true,
      },
      phone: { type: String },
      address: { type: String, required: false },
      email: { type: String },
      country: {
        type: String,
        default: "Bangladesh",
      },
      deliveryZone: {
        type: String,
        enum: ["inside_dhaka", "outside_dhaka", "sub_area"],
      },
    },
    productWeight: {
      type: Number,
      default: true,
    },
    deliveryCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryCharge",
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    // Payment
    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "Pending",
    },
    // SSlcommerz Payment Gateway
    transactionId: {
      type: String,
      default: null,
    },
    valid: {
      type: String,
      default: null,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    paymentGateway: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Order Status
    orderStatus: {
      type: String,
      enum: ["Pending", "Hold", "Confirmed", "CourierPending"],
      default: "Pending",
    },
    // InvoiceId
    invoiceId : {
        type : String,
        default : null
    },
    // Courier
    courier : {
        name : {
            type : String,
            default : null
        },
        trackingId : {
            type : String,
            default : null
        },
        rawResponse : {
            type : mongoose.Schema.Types.Mixed,
            default : null
        },
        status : {
            type : String,
            default : "Pending"
        },
    },
    followUp : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    },
    totalQuantity : {
        type : Number,
        default : null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
