import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState({
    'script.js': `// Welcome to the JavaScript Compiler!
// Write your code here and click "Run" to execute it.
`
  });
  
  const [currentFile, setCurrentFile] = useState('script.js');

  const addFile = (filename, content = '') => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [filename]: content
    }));
    setCurrentFile(filename);
  };

  const updateFileContent = (filename, content) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [filename]: content
    }));
  };

  const getCurrentFileContent = () => {
    return files[currentFile] || '';
  };

  return (
    <FileContext.Provider value={{ 
      files, 
      currentFile, 
      setCurrentFile, 
      addFile, 
      updateFileContent,
      getCurrentFileContent
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);

export default FileContext;