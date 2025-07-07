// Global state management for posts and likes
class PostManager {
  constructor() {
    this.posts = [];
    this.listeners = [];
    this.loadPosts();
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('mockPosts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }

  savePosts() {
    localStorage.setItem('mockPosts', JSON.stringify(this.posts));
    this.notifyListeners();
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.posts));
  }

  getAllPosts() {
    return this.posts;
  }

  // Get posts visible in latest feed (posts from last 24 hours)
  getLatestPosts(hoursLimit = 24) {
    const now = Date.now();
    const timeLimit = hoursLimit * 60 * 60 * 1000; // Convert hours to milliseconds
    
    return this.posts.filter(post => {
      const postTime = new Date(post.date).getTime();
      return (now - postTime) <= timeLimit;
    });
  }

  // Get posts that should be visible in feed with time-based filtering
  getVisiblePosts(hoursLimit = 24) {
    return this.getLatestPosts(hoursLimit);
  }

  getUserPosts(userId) {
    return this.posts.filter(post => post.postedBy.id === userId);
  }

  addPost(post) {
    this.posts.unshift(post);
    this.savePosts();
  }

  updatePost(updatedPost) {
    this.posts = this.posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    this.savePosts();
  }

  deletePost(postId) {
    this.posts = this.posts.filter(post => post.id !== postId);
    this.savePosts();
  }

  toggleLike(postId, userId) {
    this.posts = this.posts.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        return {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    this.savePosts();
  }

  // Clean up old posts (optional - removes posts older than specified days)
  cleanupOldPosts(daysLimit = 7) {
    const now = Date.now();
    const timeLimit = daysLimit * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    
    const originalLength = this.posts.length;
    this.posts = this.posts.filter(post => {
      const postTime = new Date(post.date).getTime();
      return (now - postTime) <= timeLimit;
    });
    
    if (this.posts.length !== originalLength) {
      this.savePosts();
      console.log(`Cleaned up ${originalLength - this.posts.length} old posts`);
    }
  }

  // Start automatic cleanup timer
  startAutoCleanup(hoursInterval = 24, daysLimit = 7) {
    // Clean up old posts every specified hours
    setInterval(() => {
      this.cleanupOldPosts(daysLimit);
    }, hoursInterval * 60 * 60 * 1000);
  }
}

// Create global instance
const postManager = new PostManager();

export default postManager;
