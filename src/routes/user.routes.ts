import express from 'express';
import {
    getAllUsers,
    getSingleUser,
    showCurrentUserProfile,
    updateUserPassword,
    updateUserProfile,
} from '../controllers/user.controller';
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

export const router = express.Router();

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);
router.get('/showMe', authenticateUser, showCurrentUserProfile);
router.patch('/updateUser', updateUserProfile);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);