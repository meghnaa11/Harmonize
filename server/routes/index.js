import express from 'express';
import userRoutes from './userRoutes.js';
import musicRoutes from './musicRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/music', musicRoutes);

export default router;
