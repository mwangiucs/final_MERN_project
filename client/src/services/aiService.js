import api from './api.js';

export const getRecommendations = async () => {
  const response = await api.post('/ai/recommend');
  return response.data;
};

export const gradeQuiz = async (quizId, answers) => {
  const response = await api.post('/ai/grade', { quizId, answers });
  return response.data;
};

export const chatWithAI = async (message, courseId = null) => {
  const response = await api.post('/ai/chat', { message, courseId });
  return response.data;
};

