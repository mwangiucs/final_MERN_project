import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCourse, getCourses } from '../services/courseService';
import api from '../services/api';

const InstructorPanel = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    aiTags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructors/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.aiTags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        aiTags: [...prev.aiTags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      aiTags: prev.aiTags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        aiTags: []
      });
      fetchCourses();
      alert('Course created successfully!');
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Instructor Panel</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create New Course'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Create New Course</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>AI Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                  />
                  <button type="button" onClick={handleAddTag} className="btn-secondary">
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.aiTags.map(tag => (
                    <span key={tag} className="card" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: 'none', padding: '0', fontSize: '1.2rem' }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary">Create Course</button>
            </form>
          </div>
        )}

        <div>
          <h2 style={{ marginBottom: '1rem' }}>My Courses</h2>
          {loading ? (
            <div>Loading...</div>
          ) : courses.length === 0 ? (
            <div className="card">No courses created yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {courses.map(course => (
                <div key={course._id} className="card">
                  <h3>{course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {course.description}
                  </p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <span>{course.category}</span>
                    <span>{course.difficulty}</span>
                    <span>Students: {course.enrolledCount || 0}</span>
                    <span>Status: {course.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default InstructorPanel;

