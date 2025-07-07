import { useState } from 'react';

const TimeFilter = ({ currentHours, onHoursChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeOptions = [
    { hours: 1, label: '1 Hour' },
    { hours: 6, label: '6 Hours' },
    { hours: 12, label: '12 Hours' },
    { hours: 24, label: '24 Hours' },
    { hours: 48, label: '2 Days' },
    { hours: 72, label: '3 Days' },
    { hours: 168, label: '1 Week' }
  ];

  const getCurrentLabel = () => {
    const option = timeOptions.find(opt => opt.hours === currentHours);
    return option ? option.label : `${currentHours} Hours`;
  };

  const handleOptionSelect = (hours) => {
    onHoursChange(hours);
    setIsExpanded(false);
  };

  return (
    <div className="time-filter">
      <button 
        className="time-filter-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        🕒 Show posts from: {getCurrentLabel()}
        <span className={`dropdown-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>
      
      {isExpanded && (
        <div className="time-filter-dropdown">
          <div className="dropdown-header">
            <h4>Show posts from:</h4>
          </div>
          {timeOptions.map((option) => (
            <button
              key={option.hours}
              className={`time-option ${currentHours === option.hours ? 'active' : ''}`}
              onClick={() => handleOptionSelect(option.hours)}
            >
              {option.label}
              {currentHours === option.hours && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
