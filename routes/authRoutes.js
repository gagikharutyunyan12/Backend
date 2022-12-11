const express = require('express')
const router = express.Router();
const {
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
} = require('../controller/userCtrl')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddlware')

router.post('/register', createUser);
router.post('/login', loginUser);
router.get("/refresh", handleRefreshToken);
router.get('/all-users', getAllUsers);
router.get('/logout', logout);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);
router.patch('/:id', updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);


module.exports = router;