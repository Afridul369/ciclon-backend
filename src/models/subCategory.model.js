const mongoose = require('mongoose');
const slugify = require('slugify');
const { customError } = require('../utils/customError');
const { Schema, Types } = mongoose;

const subCategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "SubCategory name is required"],
  },
  slug: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, "Parent Category is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

//  Automatically generate slug before save
subCategorySchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      replacement: '-',  // Replace spaces with "-"
      lower: true,       // Convert to lowercase
      strict: false,     // Allow special chars like '-'
      trim: true,        // Trim trailing '-'
    });
  }
  next();
});

//getUpdate & setUpdate
subCategorySchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate()
    if (update.name) {
        update.slug = slugify(update.name,{
            replacement: '-',  // Replace spaces with "-"
            lower: true,       // Convert to lowercase
            strict: false,     // Allow special chars like '-'
            trim: true,        // Trim trailing '-'
        })
        this.setUpdate(update)
    }
    next()
})

// Prevent duplicate slug (same name) error
subCategorySchema.pre('save', async function () {
  const existingSlug = await this.constructor.findOne({ slug: this.slug });
  if (existingSlug && existingSlug._id.toString() !== this._id.toString()) {
    throw new customError(401, "SubCategory Name Already Exist");
  }
});

module.exports = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
