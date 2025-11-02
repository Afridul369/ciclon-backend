const mongoose = require("mongoose");
const { customError } = require('../utils/customError');
const  slugify  = require("slugify");

// DeliveryCharge Schema
const deliveryChargeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Delivery charge name is required"],
    },
    slug: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
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

// Generate slug before save
deliveryChargeSchema.pre('save', function (next) {
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

// Check unique slug
deliveryChargeSchema.pre('save', async function (next) {
    const slug = await this.constructor.findOne({ slug: this.slug });
    if (slug && slug._id.toString() !== this._id.toString()) {
        throw new customError(401, 'DeliveryCharge name already exists');
    }
    next();
});

module.exports = mongoose.models.DeliveryCharge || mongoose.model("DeliveryCharge", deliveryChargeSchema);
