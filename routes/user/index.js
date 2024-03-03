import express from 'express';
import userRoutes from './v1/user/user.route';
import authRoutes from './v1/auth/auth.route';

const router = express.Router();
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
module.exports = router;
