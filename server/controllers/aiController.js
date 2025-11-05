import { getCourseRecommendations, gradeQuiz, chatWithAI } from '../services/aiService.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import Enrollment from '../models/Enrollment.js';

export const recommendCourses = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const recommendations = await getCourseRecommendations(studentId);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: quiz.courseId
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in the course to take quizzes' });
    }

    const result = await gradeQuiz(quiz, answers);

    // Save quiz result
    enrollment.quizResults.push({
      quizId: quizId.toString(),
      score: result.score,
      feedback: JSON.stringify(result.feedback),
      aiFeedback: `Overall performance: ${result.grade} (${result.percentage}%)`
    });
    await enrollment.save();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { message, courseId } = req.body;
    
    let courseContext = null;
    if (courseId) {
      courseContext = await Course.findById(courseId);
    }

    const response = await chatWithAI(message, courseContext);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

