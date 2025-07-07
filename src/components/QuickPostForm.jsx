import { useState } from 'react';

const QuickPostForm = ({ onPostCreated, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPost = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      postedBy: currentUser || {
        id: 999,
        name: "You",
        avatar: "https://ui-avatars.com/api/?name=You&background=007bff&color=fff",
        course: "Student"
      },
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };

    onPostCreated(newPost);

    // Reset form
    setFormData({
      title: '',
      description: '',
      tags: ''
    });
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      tags: ''
    });
    setIsExpanded(false);
  };

  return (
    <div className="quick-post-form">
      <div className="form-header">
        <h3>Share Something</h3>
        <span className="form-subtitle">What's on your mind?</span>
      </div>

      {!isExpanded ? (
        <div 
          className="quick-input-trigger"
          onClick={() => setIsExpanded(true)}
        >
          <div className="trigger-avatar">
            <img 
              src={currentUser?.avatar || "https://ui-avatars.com/api/?name=You&background=007bff&color=fff"} 
              alt="Your avatar"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=You&background=007bff&color=fff";
              }}
            />
          </div>
          <div className="trigger-input">
            Start a discussion...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="expanded-form">
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Give your post a title..."
              value={formData.title}
              onChange={handleInputChange}
              className="title-input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Share your thoughts, ask a question, or start a discussion..."
              value={formData.description}
              onChange={handleInputChange}
              className="description-input"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="tags"
              placeholder="Add tags (comma-separated): react, javascript, study-group..."
              value={formData.tags}
              onChange={handleInputChange}
              className="tags-input"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickPostForm;
