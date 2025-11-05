import express from 'express';
import { enrollStudent, getEnrollments, updateProgress } from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, enrollStudent);
router.post('/enroll', authenticate, enrollStudent); // Alias for POST /api/enroll
router.get('/:studentId', authenticate, getEnrollments);
router.put('/:enrollmentId/progress', authenticate, updateProgress);

export default router;

