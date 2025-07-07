import { useState } from 'react';
import PostCard from './PostCard';

const PostManager = ({ posts, onEditPost, onDeletePost, onLike }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const handleEditClick = (post) => {
    setEditingPost(post.id);
    setEditForm({
      title: post.title,
      description: post.description,
      tags: post.tags.join(', ')
    });
  };

  const handleEditSave = () => {
    const updatedPost = {
      ...posts.find(p => p.id === editingPost),
      title: editForm.title,
      description: editForm.description,
      tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };
    
    onEditPost(updatedPost);
    setEditingPost(null);
    setEditForm({ title: '', description: '', tags: '' });
  };

  const handleEditCancel = () => {
    setEditingPost(null);
    setEditForm({ title: '', description: '', tags: '' });
  };

  const handleDeleteClick = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDeletePost(postId);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="post-manager">
      <div className="manager-header">
        <h3>Manage Your Posts</h3>
        <span className="post-count">{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts-manager">
          <div className="no-posts-icon">📝</div>
          <h4>No posts yet</h4>
          <p>Start sharing your knowledge with the community!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-manager-item">
              {editingPost === post.id ? (
                <div className="edit-post-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleFormChange}
                      className="edit-textarea"
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={editForm.tags}
                      onChange={handleFormChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="edit-actions">
                    <button onClick={handleEditCancel} className="cancel-btn">
                      Cancel
                    </button>
                    <button onClick={handleEditSave} className="save-btn">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <PostCard 
                    post={post} 
                    onLike={onLike}
                    showActions={false}
                  />
                  <div className="post-management-actions">
                    <button 
                      onClick={() => handleEditClick(post)}
                      className="manage-btn edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(post.id)}
                      className="manage-btn delete-btn"
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
  );
};

export default PostManager;
