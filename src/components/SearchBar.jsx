import { useState } from 'react';

const SearchBar = ({ onSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder="Search posts by title or tags..."
          value={localSearchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {localSearchTerm && (
          <button 
            onClick={clearSearch}
            className="clear-search-btn"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      {localSearchTerm && (
        <div className="search-hint">
          Searching for: <span className="search-term">"{localSearchTerm}"</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
