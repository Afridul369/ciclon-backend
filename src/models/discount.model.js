const mongoose = require('mongoose');
const { customError } = require('../utils/customError');
const slugify = require('slugify');
const { Schema } = mongoose;

const discountSchema = new Schema({
  discountName: {
    type: String,
    trim: true,
    required: [true, "Discount name is required"],
  },
  slug: {
    type: String,
    trim: true,
  },
  discountValidFrom: {
    type: Date,
    required: [true, "Discount valid from date is required"],
  },
  discountValidTo: {
    type: Date,
    required: [true, "Discount valid to date is required"],
  },
  discountType: {
    type: String,
    enum: ['taka', 'percentance'],
    required: [true, "Discount type is required"],
  },
  discountPlan: {
    type: String,
    enum: ['flat', 'product', 'category','subcategory'],
    required: [true, "Discount plan is required"],
  },
  discountValueByAmount: {
    type: Number,
    min: [0, "Discount amount must be a positive number"],
  },
  discountValueByPercentance: {
    type: Number,
    min: [0, "Discount percentage must be a positive number"],
    max: [100, "Discount percentage cannot exceed 100%"],
  },
  targetProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  targetCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  targetSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});


//  Generate slug automatically when discountName changes
discountSchema.pre('save', async function (next) {
  if (this.isModified('discountName')) {
    this.slug = slugify(this.discountName, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

//  Prevent duplicate discount names (based on slug)
discountSchema.pre('save', async function () {
  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && existing._id.toString() !== this._id.toString()) {
    throw new customError(401, "Discount Name Already Exists");
  }
});

module.exports = mongoose.models.Discount || mongoose.model('Discount', discountSchema);
