const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const {generateToken} = require("../config/jwtToken");
const {generateRefreshToken} = require("../config/refreshToken");
const validateMongodbid = require('../utils/validateMongodbid')
const jwt = require('jsonwebtoken')

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        throw new Error('User already exist')
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(findUser?.id,
            {
                refreshToken: refreshToken
            }, {
                new: true,
            })
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 72 * 60 * 60 * 1000})
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid credentials")
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

const getSingleUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbid(id);
    try {
        const getUser = await User.findById(id);
        res.json(getUser)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongodbid(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser)
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        const updateUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true,
        });
        res.json(updateUser)
    } catch (error) {
        throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true
        })
        res.json({message: 'User blocked'})
    } catch (error) {
        throw new Error(error)
    }
})
const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true
        })
        res.json({message: 'User unblocked'})
    } catch (error) {
        throw new Error(error)
    }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if(!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204)
})


module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
}