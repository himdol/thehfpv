import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TinyMCEEditor from '../components/TinyMCEEditor';

interface WriteBlogProps {
  setCurrentPage?: (page: string) => void;
}

const WriteBlog: React.FC<WriteBlogProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'development',
    tags: '',
    publishType: 'immediate', // 'immediate' or 'scheduled'
    scheduledDate: '',
    scheduledTime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (e.target as HTMLInputElement).value : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: 백엔드 API 호출
      console.log('블로그 작성 데이터:', formData);
      
      // 임시로 성공 메시지 표시
      alert('블로그 작성이 완료되었습니다!');
      
      // 블로그 목록으로 이동
      if (setCurrentPage) {
        setCurrentPage('blog');
      }
    } catch (error) {
      console.error('블로그 작성 중 오류:', error);
      alert('블로그 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (setCurrentPage) {
      setCurrentPage('blog');
    }
  };

  return (
    <div className="write-blog-layout">
      <div className="write-blog-main">
        <div className="write-blog-container">
          {/* Header */}
          <div className="write-blog-header">
            <h1 className="write-blog-title">Write Blog</h1>
            <p className="write-blog-subtitle">새로운 블로그 포스트를 작성해보세요.</p>
          </div>

          {/* Form */}
          <motion.form 
            className="write-blog-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Blog Title"
                required
              />
            </div>

            {/* Category and Tags Row */}
            <div className="form-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="development">Development</option>
                <option value="daily">Daily Life</option>
                <option value="tech">Technology</option>
                <option value="tutorial">Tutorial</option>
                <option value="review">Review</option>
              </select>
              
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Tags (comma separated)"
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <TinyMCEEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog content here..."
                height={500}
              />
            </div>

            {/* Publish Options */}
            <div className="form-group">
              <div className="publish-options">
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="publishType"
                      value="immediate"
                      checked={formData.publishType === 'immediate'}
                      onChange={handleInputChange}
                      className="radio-input"
                    />
                    <span className="radio-text">Publish Now</span>
                  </label>
                  
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="publishType"
                      value="scheduled"
                      checked={formData.publishType === 'scheduled'}
                      onChange={handleInputChange}
                      className="radio-input"
                    />
                    <span className="radio-text">Schedule Publish</span>
                  </label>
                </div>
                
                {formData.publishType === 'scheduled' && (
                  <div className="schedule-inputs">
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleInputChange}
                      className="form-input schedule-date"
                      required={formData.publishType === 'scheduled'}
                    />
                    <input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      className="form-input schedule-time"
                      required={formData.publishType === 'scheduled'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-cancel"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
