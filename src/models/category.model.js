const mongoose = require('mongoose');
const { customError } = require('../utils/customError');
const  slugify  = require('slugify');
const { Schema, Types } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category name is required"],
    },
  image: {
    type: String,
    trim: true,
    required: [true, "Category image is required"]
  },
  slug: {
    type: String,
  },
  subCategory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

categorySchema.pre('save', async function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            strict: false,     // strip special characters except replacement, defaults to `false`
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
        })
    }
    next()
})

categorySchema.pre('save', async function () {
    const slug = await this.constructor.findOne({slug: this.slug})
    if (slug && slug._id.toString() !== this._id.toString()) {
        throw new customError(401,"Category Name Already Exist")
    }
})

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);


