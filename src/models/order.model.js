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
    deliveryZone: {
        type: String,
      },
    // Payment
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      // default: "Pending",
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
    returnStatus : {
      type : String,
      default: "No Request"
    },
    returnId : {
      type : Number
    },
    returnStatusHistory : {
      type : mongoose.Schema.Types.Mixed,
      default : null
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
