import PostCard from './PostCard';

const PostFeed = ({ posts, searchTerm, onLike, onComment, timeFilterHours = 24 }) => {
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(searchLower);
    const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchLower));
    
    return titleMatch || tagMatch;
  });

  const formatTimeFilter = (hours) => {
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours < 168) return `${Math.round(hours / 24)} day${hours > 24 ? 's' : ''}`;
    return `${Math.round(hours / 168)} week${hours > 168 ? 's' : ''}`;
  };

  if (filteredPosts.length === 0 && searchTerm) {
    return (
      <div className="post-feed">
        <div className="post-feed-header">
          <div className="feed-status">
            Showing posts from the last {formatTimeFilter(timeFilterHours)} • 0 posts found
          </div>
        </div>
        <div className="no-posts-found">
          <div className="no-posts-icon">🔍</div>
          <h3>No posts found</h3>
          <p>Try adjusting your search terms or browse all posts</p>
        </div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="post-feed">
        <div className="post-feed-header">
          <div className="feed-status">
            Showing posts from the last {formatTimeFilter(timeFilterHours)} • 0 posts
          </div>
        </div>
        <div className="no-posts">
          <div className="no-posts-icon">📝</div>
          <h3>No recent posts</h3>
          <p>No posts found in the selected time period.</p>
          <p>Try increasing the time filter or create a new post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-feed">
      <div className="post-feed-header">
        <div className="feed-status">
          Showing posts from the last {formatTimeFilter(timeFilterHours)} • {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>
      
      <div className="posts-container">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={onLike}
            onComment={onComment}
          />
        ))}
      </div>
    </div>
  );
};

export default PostFeed;
