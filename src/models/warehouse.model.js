const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const { customError } = require('../utils/customError');

const warehouseLocationSchema = new Schema({
  warehouselocation: {
    type: String,
    trim: true,
    required: [true, 'Location is required'],
  },
  wareHouseName: {
    type: String,
    trim: true,
    required: [true, 'Warehouse name is required'],
  },
}, {
  timestamps: true,
});

// Generate slug automatically
warehouseLocationSchema.pre('save', async function (next) {
  if (this.isModified('wareHouseName')) {
    this.slug = slugify(this.wareHouseName, {
      lower: true,
      replacement: '-',
      trim: true,
    });
  }
  next();
});

// Prevent duplicate slug
warehouseLocationSchema.pre('save', async function () {
  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && existing._id.toString() !== this._id.toString()) {
    throw new customError(401, 'Warehouse location already exists');
  }
});

module.exports = mongoose.models.WarehouseLocation || mongoose.model('WarehouseLocation', warehouseLocationSchema);
