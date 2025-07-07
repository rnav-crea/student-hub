const { validationResult } = require('express-validator');
const Post = require('../models/Post');

// Create a new post
const createPost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, content, category, tags } = req.body;
    const author = req.user._id;
    const authorUsername = req.user.username;

    // Create new post
    const post = new Post({
      title,
      content,
      author,
      authorUsername,
      category,
      tags: tags || []
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'username profilePicture');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      message: 'Server error while creating post'
    });
  }
};

// Get all posts with pagination and filtering
const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      author,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { isActive: true };
    let sortOptions = {};

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add author filter
    if (author) {
      query.author = author;
    }

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Set sort options
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const posts = await Post.find(query)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .populate('author', 'username profilePicture')
      .lean();

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limitNum);

    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Server error while fetching posts'
    });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({ _id: id, isActive: true })
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    res.json({ post });

  } catch (error) {
    console.error('Get post by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while fetching post'
    });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, content, category, tags } = req.body;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findOne({ _id: id, isActive: true });
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You can only update your own posts'
      });
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    
    post.updatedAt = new Date();

    await post.save();

    // Populate author information
    await post.populate('author', 'username profilePicture');

    res.json({
      message: 'Post updated successfully',
      post
    });

  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while updating post'
    });
  }
};

// Delete a post (soft delete)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findOne({ _id: id, isActive: true });
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own posts'
      });
    }

    // Soft delete the post
    post.isActive = false;
    await post.save();

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while deleting post'
    });
  }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const username = req.user.username;

    // Find the post
    const post = await Post.findOne({ _id: id, isActive: true });
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user has already liked the post
    const isLiked = post.isLikedBy(userId);

    if (isLiked) {
      // Unlike the post
      post.removeLike(userId);
    } else {
      // Like the post
      post.addLike(userId, username);
    }

    await post.save();

    res.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      liked: !isLiked,
      likesCount: post.likesCount,
      likes: post.likes
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while toggling like'
    });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    const username = req.user.username;

    // Find the post
    const post = await Post.findOne({ _id: id, isActive: true });
    
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Add comment
    post.addComment(userId, username, content);
    await post.save();

    // Get the newly added comment
    const newComment = post.comments[post.comments.length - 1];
    
    // Populate user information for the new comment
    await post.populate('comments.user', 'username profilePicture');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
      commentsCount: post.commentsCount
    });

  } catch (error) {
    console.error('Add comment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while adding comment'
    });
  }
};

// Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get user's posts
    const posts = await Post.find({ 
      author: userId, 
      isActive: true 
    })
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .populate('author', 'username profilePicture')
      .lean();

    // Get total count
    const totalPosts = await Post.countDocuments({ 
      author: userId, 
      isActive: true 
    });
    
    const totalPages = Math.ceil(totalPosts / limitNum);

    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error while fetching user posts'
    });
  }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get posts by category
    const posts = await Post.find({ 
      category, 
      isActive: true 
    })
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip)
      .populate('author', 'username profilePicture')
      .lean();

    // Get total count
    const totalPosts = await Post.countDocuments({ 
      category, 
      isActive: true 
    });
    
    const totalPages = Math.ceil(totalPosts / limitNum);

    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPosts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({
      message: 'Server error while fetching posts by category'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts,
  getPostsByCategory
};
