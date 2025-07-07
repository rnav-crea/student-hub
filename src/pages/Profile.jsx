import { useState, useEffect } from 'react';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import PostCard from '../components/PostCard';
import Toast from '../components/Toast';
import postManager from '../services/postManager';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [editingPost, setEditingPost] = useState(null);
  const [profileLikes, setProfileLikes] = useState(0);
  const [profileVisits, setProfileVisits] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load profile stats and increment visits
      const profileStats = localStorage.getItem(`profile_${parsedUser.id}`) || '{"likes":0,"visits":0}';
      const stats = JSON.parse(profileStats);
      
      // Increment visits
      const newVisits = stats.visits + 1;
      const updatedStats = { likes: stats.likes, visits: newVisits };
      localStorage.setItem(`profile_${parsedUser.id}`, JSON.stringify(updatedStats));
      
      setProfileLikes(stats.likes);
      setProfileVisits(newVisits);
    }

    // Load user posts from post manager
    loadUserPosts();

    // Listen for post updates
    const handlePostUpdate = (posts) => {
      if (user) {
        const userPostsList = posts.filter(post => post.postedBy.id === user.id);
        setUserPosts(userPostsList);
      }
    };

    postManager.addListener(handlePostUpdate);

    return () => {
      postManager.removeListener(handlePostUpdate);
    };
  }, [user?.id]);

  const loadUserPosts = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        const userPostsList = postManager.getUserPosts(currentUser.id);
        setUserPosts(userPostsList);
      }
    } catch (error) {
      setError('Failed to fetch your posts');
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostLike = (postId) => {
    postManager.toggleLike(postId, user?.id);
  };

  const handleProfileLike = () => {
    const newLikes = profileLikes + 1;
    setProfileLikes(newLikes);
    
    // Save profile stats
    const stats = { likes: newLikes, visits: profileVisits };
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(stats));
    
    showToast('Profile liked! 👍');
  };

  const getTotalPostLikes = () => {
    return userPosts.reduce((total, post) => total + (post.likes || 0), 0);
  };

  const handleAvatarChange = (newAvatarUrl) => {
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showToast('Profile picture updated successfully!');
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleSaveEdit = (updatedPost) => {
    postManager.updatePost(updatedPost);
    setEditingPost(null);
    showToast('Post updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      postManager.deletePost(postId);
      showToast('Post deleted successfully!', 'info');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Simple Edit Form Component
  const EditForm = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: post.title,
      description: post.description,
      tags: post.tags.join(', ')
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedPost = {
        ...post,
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      onSave(updatedPost);
    };

    return (
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="comma, separated, tags"
          />
        </div>
        <div className="edit-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </form>
    );
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      {/* Toast Notifications */}
      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <div className="profile-header">
        <div className="profile-avatar-section">
          <ProfilePictureUpload
            currentAvatar={user?.avatar}
            userName={user?.name || 'User'}
            onAvatarChange={handleAvatarChange}
          />
        </div>
        
        <div className="profile-info">
          <div className="profile-header-top">
            <h1 className="profile-name">{user?.name}</h1>
            <button className="profile-like-btn" onClick={handleProfileLike}>
              ❤️ {profileLikes}
            </button>
          </div>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{userPosts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getTotalPostLikes()}</span>
              <span className="stat-label">Post Likes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{profileVisits}</span>
              <span className="stat-label">Profile Views</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-posts-section">
          <h2 className="section-title">
            <span className="section-icon">📝</span>
            Your Posts
            <span className="post-count">({userPosts.length})</span>
          </h2>
          {userPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>No posts yet</h3>
              <p>You haven't created any posts yet.</p>
              <p>Share your knowledge with the community!</p>
              <button className="btn btn-primary" onClick={() => window.location.href = '/create-post'}>
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="posts-container">
              {userPosts.map((post) => (
                <div key={post.id} className="post-item">
                  {editingPost?.id === post.id ? (
                    <EditForm 
                      post={editingPost} 
                      onSave={handleSaveEdit} 
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <>
                      <PostCard 
                        post={post} 
                        onLike={handlePostLike}
                      />
                      <div className="post-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditPost(post)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
