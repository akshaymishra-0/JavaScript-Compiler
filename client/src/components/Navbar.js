import React from 'react';
import { FaMoon, FaSun, FaGithub, FaCode } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaCode className="logo-icon" />
        <span className="logo-text">JavaScript Compiler</span>
      </div>
      <div className="navbar-actions">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
        <a 
          href="https://github.com/akshaymishra-0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
          title="Visit GitHub"
        >
          <FaGithub />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;