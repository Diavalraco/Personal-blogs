import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const SearchBar = ({ formSubmit, value, handleSearchKey, clearSearch }) => {
  const [showOptions, setShowOptions] = useState(false);
  const options = ['Blogs', 'Stories', 'Poems', 'Thoughts'];
  const wrapperRef = useRef(null);

  const handleOptionClick = (option) => {
    handleSearchKey({ target: { value: option } });
    setShowOptions(false);
  };

  const handleInputFocus = () => {
    setShowOptions(true); 
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchBar-wrap" ref={wrapperRef}>
      <form onSubmit={formSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search By Category"
          value={value}
          onFocus={handleInputFocus}
          onChange={handleSearchKey}
          className="search-input"
        />
        {value && (
          <span 
            onClick={clearSearch} 
            className="clear-btn"
            role="button" 
            aria-label="Clear search"
          >
            &times;
          </span>
        )}
        <button type="submit" className="submit-btn">Go</button>
      </form>
      {showOptions && (
        <div className="options animated-dropdown">
          {options.map((option) => (
            <div 
              key={option} 
              className="option" 
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
