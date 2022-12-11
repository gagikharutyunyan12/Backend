const express = require('express')
const {createPost, getAllPosts, getSinglePost, updatePost, deletePost, addToWishlist} = require("../controller/PostCtrl");
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlware')
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createPost)
router.get('/', authMiddleware, getAllPosts)
router.get('/:id', authMiddleware, getSinglePost)
router.patch('/:id', authMiddleware, isAdmin, updatePost)
router.delete('/:id', authMiddleware, isAdmin, deletePost)
router.put('/wishlist', authMiddleware, addToWishlist)

module.exports = router