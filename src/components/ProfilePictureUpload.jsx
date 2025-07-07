import { useState } from 'react';

const ProfilePictureUpload = ({ currentAvatar, userName, onAvatarChange }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);

  // Generate default avatar URL
  const getDefaultAvatar = (name) => {
    const colors = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1', 'fd7e14', '20c997'];
    const colorIndex = name.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff&size=128&font-size=0.5`;
  };

  const handleAvatarClick = () => {
    setIsChanging(!isChanging);
  };

  const handleAvatarSelect = (type, url = null) => {
    let newAvatar;
    
    if (type === 'default') {
      newAvatar = getDefaultAvatar(userName);
    } else if (type === 'preset') {
      newAvatar = url;
    } else if (type === 'upload') {
      // In a real app, this would handle file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const uploadedUrl = e.target.result;
            setPreviewUrl(uploadedUrl);
            onAvatarChange(uploadedUrl);
            setIsChanging(false);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }
    
    setPreviewUrl(newAvatar);
    onAvatarChange(newAvatar);
    setIsChanging(false);
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face'
  ];

  return (
    <div className="profile-picture-upload">
      <div className="current-avatar-container">
        <img 
          src={previewUrl || getDefaultAvatar(userName)} 
          alt={userName}
          className="current-avatar"
          onClick={handleAvatarClick}
          onError={(e) => {
            e.target.src = getDefaultAvatar(userName);
          }}
        />
        <button className="change-avatar-btn" onClick={handleAvatarClick}>
          📷
        </button>
      </div>

      {isChanging && (
        <div className="avatar-options">
          <div className="avatar-options-header">
            <h4>Change Profile Picture</h4>
            <button className="close-options" onClick={() => setIsChanging(false)}>✕</button>
          </div>
          
          <div className="avatar-section">
            <h5>Default Avatar</h5>
            <div className="default-avatar-preview">
              <img 
                src={getDefaultAvatar(userName)} 
                alt="Default"
                className="avatar-option"
                onClick={() => handleAvatarSelect('default')}
              />
              <span>Generated from your name</span>
            </div>
          </div>

          <div className="avatar-section">
            <h5>Choose from Gallery</h5>
            <div className="preset-avatars">
              {presetAvatars.map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={`Option ${index + 1}`}
                  className="avatar-option"
                  onClick={() => handleAvatarSelect('preset', url)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>

          <div className="avatar-section">
            <button 
              className="upload-btn"
              onClick={() => handleAvatarSelect('upload')}
            >
              📁 Upload Your Own
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
