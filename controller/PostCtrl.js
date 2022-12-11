const Post = require('../models/postSchema')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const createPost = asyncHandler(async (req, res) => {
    try {
        const newPost = await Post.create(req.body)
        res.json(newPost)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const queryObject = { ...req.query }
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach(el => delete queryObject[el])

        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Post.find(JSON.parse(queryString))


        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }


        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }


        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page) {
            const postCount = await Post.countDocuments();
            if(skip >= postCount) throw new Error("This Page does not exists")
        }


        const post = await query
        res.json(post)
    } catch (error) {
        throw new Error(error)
    }
})

const getSinglePost = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const findPost = await Post.findById(id)
        res.json(findPost)
    } catch (error) {
        throw new Error(error)
    }
})

const updatePost = asyncHandler(async (req, res) => {
    const id = req.params
    try {
        const findPost = await Post.findOneAndUpdate(id, req.body,{
            new: true
        })
        res.json(findPost)
    } catch (error) {
        throw new Error(error)
    }
})

const deletePost = asyncHandler(async (req, res) => {
    const id = req.params
    try {
        const deletePost = await Post.findOneAndDelete(id)
        res.json({deletedPost: deletePost, message: "Post successfully deleted"})
    } catch (error) {
        throw new Error(error)
    }
})

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { postId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === postId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: postId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: postId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = { createPost, getAllPosts, getSinglePost, updatePost, deletePost, addToWishlist }