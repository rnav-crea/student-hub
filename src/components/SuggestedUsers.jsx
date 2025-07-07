import { useState } from 'react';

const SuggestedUsers = ({ suggestedUsers, onConnect }) => {
  const [connectedUsers, setConnectedUsers] = useState(new Set());
  const [pendingConnections, setPendingConnections] = useState(new Set());

  const handleConnect = async (userId) => {
    setPendingConnections(prev => new Set([...prev, userId]));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setConnectedUsers(prev => new Set([...prev, userId]));
    setPendingConnections(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    if (onConnect) onConnect(userId);
  };

  return (
    <div className="suggested-users">
      <div className="section-header">
        <h3>Suggested Connections</h3>
        <span className="section-subtitle">Connect with fellow students</span>
      </div>

      <div className="users-list">
        {suggestedUsers.map((user) => {
          const isConnected = connectedUsers.has(user.id);
          const isPending = pendingConnections.has(user.id);
          
          return (
            <div key={user.id} className="user-card">
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
                  <div className="user-skills">
                    {user.skills.slice(0, 2).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 2 && (
                      <span className="skill-more">+{user.skills.length - 2}</span>
                    )}
                  </div>
                  <p className="user-connections">
                    {user.connectionsCount} connections • {user.mutualConnections} mutual
                  </p>
                </div>
              </div>
              
              <button 
                className={`connect-btn ${isConnected ? 'connected' : ''} ${isPending ? 'pending' : ''}`}
                onClick={() => handleConnect(user.id)}
                disabled={isConnected || isPending}
              >
                {isConnected ? '✓ Connected' : isPending ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="see-more">
        <button className="see-more-btn">
          See More Suggestions →
        </button>
      </div>
    </div>
  );
};

export default SuggestedUsers;
