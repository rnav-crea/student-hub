import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PostFeed from '../components/PostFeed';
import QuickPostForm from '../components/QuickPostForm';
import SuggestedUsers from '../components/SuggestedUsers';
import Leaderboard from '../components/Leaderboard';
import Toast from '../components/Toast';
import TimeFilter from '../components/TimeFilter';
import postManager from '../services/postManager';
import { suggestedUsers, leaderboard } from '../data/mockUsers';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [postVisibilityHours, setPostVisibilityHours] = useState(24); // Default 24 hours

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load posts from post manager
    loadPosts();

    // Listen for post updates
    const handlePostUpdate = (allPosts) => {
      // Filter posts to show only recent ones in the feed
      const visiblePosts = postManager.getVisiblePosts(postVisibilityHours);
      setPosts(visiblePosts);
    };

    postManager.addListener(handlePostUpdate);

    // Start automatic cleanup (clean posts older than 7 days every 24 hours)
    postManager.startAutoCleanup(24, 7);

    return () => {
      postManager.removeListener(handlePostUpdate);
    };
  }, [postVisibilityHours]);

  const loadPosts = () => {
    try {
      // Load only recent posts for the feed
      const visiblePosts = postManager.getVisiblePosts(postVisibilityHours);
      setPosts(visiblePosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTimeFilterChange = (hours) => {
    setPostVisibilityHours(hours);
    // Reload posts with new time filter
    const visiblePosts = postManager.getVisiblePosts(hours);
    setPosts(visiblePosts);
  };

  const handlePostCreated = (newPost) => {
    // Mark the post as newly created
    const postWithNewFlag = {
      ...newPost,
      isNew: true,
      createdAt: Date.now()
    };
    
    postManager.addPost(postWithNewFlag);
    setToast({
      isVisible: true,
      message: `Your post "${newPost.title}" has been published successfully! 🎉`,
      type: 'success'
    });

    // Remove the "new" flag after 30 seconds
    setTimeout(() => {
      const allPosts = postManager.getAllPosts();
      const updatedPosts = allPosts.map(post => 
        post.id === newPost.id 
          ? { ...post, isNew: false }
          : post
      );
      postManager.posts = updatedPosts;
      postManager.savePosts();
    }, 30000);
  };

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleLike = (postId) => {
    postManager.toggleLike(postId, user?.id);
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
    // This would open a comment modal or navigate to post detail
  };

  const handleConnect = (userId) => {
    console.log('Connect with user:', userId);
    // This would send a connection request
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      {/* Welcome Header */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back{user ? `, ${user.name}` : ''}! 👋</h1>
          <p>Connect, collaborate, and share knowledge with fellow students</p>
        </div>
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Posts Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">127</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">23</span>
            <span className="stat-label">Study Groups</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="home-layout">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <SuggestedUsers 
            suggestedUsers={suggestedUsers} 
            onConnect={handleConnect}
          />
        </aside>

        {/* Main Feed */}
        <main className="main-feed">
          <QuickPostForm 
            onPostCreated={handlePostCreated}
            currentUser={user}
          />
          
          <TimeFilter 
            currentHours={postVisibilityHours}
            onHoursChange={handleTimeFilterChange}
          />
          
          <SearchBar 
            onSearch={handleSearch}
            searchTerm={searchTerm}
          />
          
          <PostFeed 
            posts={posts}
            searchTerm={searchTerm}
            onLike={handleLike}
            onComment={handleComment}
            timeFilterHours={postVisibilityHours}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <Leaderboard leaderboard={leaderboard} />
        </aside>
      </div>
    </div>
  );
};

export default Home;
