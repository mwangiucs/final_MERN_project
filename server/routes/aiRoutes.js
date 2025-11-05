import express from 'express';
import { recommendCourses, gradeSubmission, chat } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', authenticate, recommendCourses);
router.post('/grade', authenticate, gradeSubmission);
router.post('/chat', authenticate, chat);

export default router;

