const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts,
  getPostsByCategory
} = require('../controllers/postController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['general', 'study-group', 'project', 'help', 'announcement', 'discussion'])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters')
];

const updatePostValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ max: 5000 })
    .withMessage('Content cannot exceed 5000 characters'),
  
  body('category')
    .optional()
    .isIn(['general', 'study-group', 'project', 'help', 'announcement', 'discussion'])
    .withMessage('Invalid category'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot exceed 30 characters')
];

const addCommentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

const postIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid post ID')
];

const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'likesCount', 'commentsCount'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Routes

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, createPostValidation, createPost);

// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public (but user data included if authenticated)
router.get('/', optionalAuth, queryValidation, getPosts);

// @route   GET /api/posts/category/:category
// @desc    Get posts by category
// @access  Public
router.get('/category/:category', queryValidation, getPostsByCategory);

// @route   GET /api/posts/user/:userId
// @desc    Get posts by specific user
// @access  Public
router.get('/user/:userId', userIdValidation, queryValidation, getUserPosts);

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id', postIdValidation, getPostById);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (only post author)
router.put('/:id', authenticate, updatePostValidation, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete a post (soft delete)
// @access  Private (only post author)
router.delete('/:id', authenticate, postIdValidation, deletePost);

// @route   POST /api/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.post('/:id/like', authenticate, postIdValidation, toggleLike);

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', authenticate, addCommentValidation, addComment);

module.exports = router;
