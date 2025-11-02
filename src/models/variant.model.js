const mongoose = require('mongoose');
const { customError } = require('../utils/customError');
const slugify = require('slugify');
const { Schema, Types } = mongoose;

const variantSchema = new Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, "Product reference is required"],
    },
  variantName: {
    type: String,
    trim: true,
    required: [true, "Variant name is required"],
  },
  variantDescription: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    required: [true, "Variant size is required"],
  },
  color: {
    type: String,
    default : 'N/A'
  },
  slug: {
    type: String,
    trim: true,
  },
  stockVariant: {
    type: Number,
    required: [true, "Stock quantity is required"],
  },
  alertVariantStock: {
    type: Number,
    default: 5,
  },
  retailPrice: {
    type: Number,
    required: [true, "Retail price is required"],
  },
  wholesalePrice: {
    type: Number,
    required: [true, "Wholesale price is required"],
  },
  image :[ 
    {
        type: String,
    }
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  isActive: {
    type: Boolean,
    default: true,
  },
  totalSale : {
    type : Number,
    min : 0
  }
}, {
  timestamps: true,
});


//  Generate slug from variantName before saving
variantSchema.pre('save', async function (next) {
  if (this.isModified('variantName')) {
    this.slug = slugify(this.variantName, {
      replacement: '-',
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

// ------- update slug on update ------- //
variantSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.variantName) {
    update.slug = slugify(update.variantName, {
      replacement: "-",
      lower: true,
      strict: true,
      trim: true,
    });
    this.setUpdate(update);
  }
  next();
});



//  Prevent duplicate slug
variantSchema.pre('save', async function () {
  const existingSlug = await this.constructor.findOne({ slug: this.slug });
  if (existingSlug && existingSlug._id.toString() !== this._id.toString()) {
    throw new customError(401, "Variant name already exists");
  }
});

module.exports = mongoose.models.Variant || mongoose.model('Variant', variantSchema);
