import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const SearchBar = ({ formSubmit, value, handleSearchKey, clearSearch }) => {
  const [showOptions, setShowOptions] = useState(false); // State to control dropdown visibility
  const options = ['Blog', 'Story', 'Poems', 'Thoughts'];
  const wrapperRef = useRef(null); // Ref for the wrapper to detect clicks outside

  const handleOptionClick = (option) => {
    handleSearchKey({ target: { value: option } }); // Set the input value to the selected option
    setShowOptions(false); // Hide options after selection
  };

  const handleInputFocus = () => {
    setShowOptions((prev) => !prev); // Toggle dropdown visibility on input focus
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowOptions(false); // Close options if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener on mount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up on unmount
    };
  }, []);

  return (
    <div className='searchBar-wrap' ref={wrapperRef}>
      <form onSubmit={formSubmit}>
        <input
          type='text'
          placeholder='Search By Category'
          value={value}
          onFocus={handleInputFocus} // Toggle options on focus
          onChange={handleSearchKey}
        />
        {value && (
          <span 
            onClick={clearSearch} 
            style={{ color: 'darkgrey' }} // Set the color to dark grey
          >
            X
          </span>
        )}
        <button type="submit">Go</button>
      </form>
      {showOptions && (
        <div className='options'>
          {options.map((option) => (
            <div 
              key={option} 
              className='option' 
              onClick={() => handleOptionClick(option)} // Handle option click
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
