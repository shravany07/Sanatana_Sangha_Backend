import express from 'express';
import userRoutes from './v1/user/user.route';

const router = express.Router();
router.use('/user', userRoutes);
module.exports = router;
