const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    minlength: [1, 'Content cannot be empty'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['general', 'study-group', 'project', 'help', 'announcement', 'discussion'],
      message: 'Category must be one of: general, study-group, project, help, announcement, discussion'
    }
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  commentsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isActive: 1, createdAt: -1 });

// Update likesCount when likes array changes
postSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  if (this.isModified('comments')) {
    this.commentsCount = this.comments.length;
  }
  next();
});

// Instance method to check if user has liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Instance method to add a like
postSchema.methods.addLike = function(userId, username) {
  if (!this.isLikedBy(userId)) {
    this.likes.push({ user: userId, username });
    this.likesCount = this.likes.length;
  }
  return this;
};

// Instance method to remove a like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  this.likesCount = this.likes.length;
  return this;
};

// Instance method to add a comment
postSchema.methods.addComment = function(userId, username, content) {
  this.comments.push({ user: userId, username, content });
  this.commentsCount = this.comments.length;
  return this;
};

// Static method to find posts by category
postSchema.statics.findByCategory = function(category, limit = 10, skip = 0) {
  return this.find({ category, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('author', 'username profilePicture');
};

// Static method to find recent posts
postSchema.statics.findRecent = function(limit = 10, skip = 0) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('author', 'username profilePicture');
};

// Static method to search posts
postSchema.statics.searchPosts = function(searchTerm, limit = 10, skip = 0) {
  const searchRegex = new RegExp(searchTerm, 'i');
  return this.find({
    isActive: true,
    $or: [
      { title: searchRegex },
      { content: searchRegex },
      { tags: { $in: [searchRegex] } }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('author', 'username profilePicture');
};

module.exports = mongoose.model('Post', postSchema);
