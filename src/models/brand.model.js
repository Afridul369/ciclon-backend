const mongoose = require('mongoose');
const { customError } = require('../utils/customError');
const slugify = require('slugify');
const { Schema } = mongoose;

const brandSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Brand name is required"],
  },
  image: {
    type: String,
    trim: true,
    required: [true, "Brand image is required"],
  },
  slug: {
    type: String,
    trim: true,
  },
  since: {
    type: Number,
    required: [true, "Brand founding year (since) is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

//  Generate slug automatically when name changes
brandSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

//  Prevent duplicate brand names
brandSchema.pre('save', async function () {
  const existingBrand = await this.constructor.findOne({ slug: this.slug });
  if (existingBrand && existingBrand._id.toString() !== this._id.toString()) {
    throw new customError(401, "Brand Name Already Exist");
  }
});

module.exports = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
