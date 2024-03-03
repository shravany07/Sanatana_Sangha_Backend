import express from 'express';

import docsRoutes from './common/docs/swagger.route';

const userRoutes = require('./user');
const adminRoutes = require('./admin');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/docs', docsRoutes);
module.exports = router;
