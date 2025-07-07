const Leaderboard = ({ leaderboard }) => {
  return (
    <div className="leaderboard">
      <div className="section-header">
        <h3>Top Contributors</h3>
        <span className="section-subtitle">Most active this month</span>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div key={user.id} className={`leaderboard-item rank-${index + 1}`}>
            <div className="rank-badge">
              <span className="rank-emoji">{user.badge}</span>
              <span className="rank-number">#{index + 1}</span>
            </div>
            
            <div className="user-info">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="user-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007bff&color=fff`;
                }}
              />
              <div className="user-details">
                <h4 className="user-name">{user.name}</h4>
                <p className="user-course">{user.course}</p>
              </div>
            </div>
            
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{user.postCount}</span>
                <span className="stat-label">posts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <div className="your-rank">
          <span className="rank-text">Your rank: #8 with 3 posts</span>
          <span className="rank-encouragement">Keep posting to climb higher! 📈</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
