import { useState } from 'react';

const PostCard = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    if (onLike) onLike(post.id);
  };

  const handleComment = () => {
    if (onComment) onComment(post.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className={`post-card ${post.isNew ? 'new-post' : ''}`}>
      {post.isNew && <div className="new-badge">New!</div>}
      
      <div className="post-header">
        <div className="author-info">
          <img 
            src={post.postedBy.avatar} 
            alt={post.postedBy.name}
            className="author-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.postedBy.name)}&background=007bff&color=fff`;
            }}
          />
          <div className="author-details">
            <h4 className="author-name">{post.postedBy.name}</h4>
            <span className="author-course">{post.postedBy.course}</span>
          </div>
        </div>
        <span className="post-time">{formatDate(post.date)}</span>
      </div>
      
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="post-actions">
        <button 
          onClick={handleLike}
          className={`action-btn like-btn ${liked ? 'liked' : ''}`}
        >
          <span className="action-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="action-count">{likeCount}</span>
        </button>
        
        <button 
          onClick={handleComment}
          className="action-btn comment-btn"
        >
          <span className="action-icon">💬</span>
          <span className="action-count">{post.comments}</span>
        </button>
        
        <button className="action-btn share-btn">
          <span className="action-icon">📤</span>
          <span className="action-text">Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
