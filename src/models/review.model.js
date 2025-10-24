const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const { customError } = require('../utils/customError');

const reviewSchema = new Schema({
  comment: {
    type: String,
    trim: true,
    // required: [true, 'Comment is required'],
  },
  rating: {
    type: Number,
    // required: [true, 'Rating is required'],
    min: 0,
    max: [5, "Max Rating Is 5"],
  },
  reviewerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Reviewer is required'],
  },
}, {
  timestamps: true,
});

// Generate slug automatically from comment (shortened version)
// reviewSchema.pre('save', async function (next) {
//   if (this.isModified('comment')) {
    // create a slug from first 30 characters of comment
//     this.slug = slugify(this.comment.substring(0, 30), {
//       lower: true,
//       replacement: '-',
//       trim: true,
//     });
//   }
//   next();
// });

// Prevent duplicate slug (i.e., same comment by same reviewer)
// reviewSchema.pre('save', async function () {
//   const existing = await this.constructor.findOne({ 
//     slug: this.slug,
//     reviewerName: this.reviewerName 
//   });
//   if (existing && existing._id.toString() !== this._id.toString()) {
//     throw new customError(401, 'You have already added this review');
//   }
// });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
