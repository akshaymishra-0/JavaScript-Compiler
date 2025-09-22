import React, { useState } from 'react';
import { FaPlus, FaFile, FaBars, FaTimes } from 'react-icons/fa';
import { useFile } from '../context/FileContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { currentFile, setCurrentFile, addFile } = useFile();
  const [isOpen, setIsOpen] = useState(true);
  
  const handleNewFile = () => {
    const filename = prompt('Enter new file name:', 'new-script.js');
    if (filename) {
      if (!filename.endsWith('.js')) {
        addFile(`${filename}.js`, '// Write your JavaScript code here\n\n');
      } else {
        addFile(filename, '// Write your JavaScript code here\n\n');
      }
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isOpen ? (
        <div className="file-container">
          <div className="current-file">
            <FaFile className="file-icon" />
            <span className="filename">{currentFile}</span>
          </div>
          <div className="sidebar-actions">
            <button className="add-file-btn" onClick={handleNewFile} title="Add new file">
              <FaPlus />
            </button>
            <button className="toggle-sidebar-btn" onClick={toggleSidebar} title="Close sidebar">
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <button className="open-sidebar-btn" onClick={toggleSidebar} title="Open sidebar">
          <FaBars />
        </button>
      )}
    </div>
  );
};

export default Sidebar;