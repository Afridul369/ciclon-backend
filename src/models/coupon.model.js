const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../utils/customError');
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    slug: {
      type: String,
    },
    code: {
      type: String,
      trim: true,
      required: [true, "Coupon code is required"],
      unique: true,
    },
    expireAt: {
      type: Date,
      required: [true, "Coupon expiry date is required"],
    },
    usageLimit: {
      type: Number,
      default: 50,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountType: {
      type: String,
      enum: ["percentance", "tk"],
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
    },
    minimumOrderQuantity: {
      type: Number,
      default: 0,
    },
    minimumAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//  Auto-generate slug before save
couponSchema.pre("save", async function (next) {
  if (this.isModified("code")) {
    this.slug = slugify(this.code, {
      replacement: "-",
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

// Auto-update slug when code changes via findOneAndUpdate
couponSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.code) {
    update.slug = slugify(update.code, {
      replacement: "-",
      lower: true,
      strict: false,
      trim: true,
    });
    this.setUpdate(update);
  }
  next();
});

//  Prevent duplicate coupon slug
couponSchema.pre("save", async function () {
  const existingSlug = await this.constructor.findOne({ slug: this.slug });
  if (existingSlug && existingSlug._id.toString() !== this._id.toString()) {
    throw new customError(401, "Coupon code already exists");
  }
});

module.exports =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
