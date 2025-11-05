const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const slugify = require('slugify');
const { customError } = require('../utils/customError');
const { required } = require('joi');

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Product name is required'],
  },
  image: [{}],
  tag: [
    {
      type: String,
      trim: true,
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
  },
  manufactureCountry: {
    type: String,
    trim: true,
    allow: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  warrantyInformation: {
    type: String,
    trim: true,
  },
  warrantyClaim: {
    type: Boolean,
    default: true,
  },
  warrantyExpires: {
    type: Date,
  },
  availabilityStatus: {
    type: String,
    enum: ['In Stock', 'Out Of Stock', 'PreOrder'],
  },
  shippingInformation: {
    type: String,
    trim: true,
  },
  Sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    trim: true,
  },
  QrCode: {
    type: String,
    trim: true,
  },
  barCode: {
    type: String,
    trim: true,
  },
  groupUnit: {
    type: String,
    enum: ['Box', 'Packet', 'Dozen', 'Custom'],
  },
  groupUnitQuantity: {
    type: Number,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['Piece', 'Kg', 'Gram', 'Packet', 'Custom'],
  },
  variantType: {
    type: String,
    enum: ['single', 'multiple'],
    required: true
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom', 'N/A'],
  },
  color: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    min: 0,
  },
  warehouseLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WarehouseLocation',
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  variant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  retailPrice: {
    type: Number,
    // required: [true, 'Retail price is required'],
    min: 0,
  },
  retailPriceProfitAmount: {
    type: Number,
    min: 0,
  },
  retailPriceProfitPercentance: {
    type: Number,
    min: 0,
    max: 100,
  },
  wholesalePrice: {
    type: Number,
    min: 0,
  },
  alertQuantity: {
    type: Number,
    min: 0,
  },
  stockAlert: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  minimumOrderQuantity: {
    type: Number,
    default: 1,
  },
  totalSale : {
    type : Number,
    min : 0
  }
}, {
  timestamps: true,
});

//  Generate slug automatically
productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      replacement: '-',
      trim: true,
    });
  }
  next();
});

//  Prevent duplicate slug
productSchema.pre('save', async function () {
  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && existing._id.toString() !== this._id.toString()) {
    throw new customError(401, 'Product name already exists');
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
