import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Split from 'react-split';
import CodeEditor from '../components/CodeEditor';
import OutputPanel from '../components/OutputPanel';
import { useFile } from '../context/FileContext';
import '../styles/Compiler.css';

const Compiler = () => {
  const { currentFile, getCurrentFileContent, updateFileContent } = useFile();
  const [code, setCode] = useState(getCurrentFileContent());
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update code when current file changes
  useEffect(() => {
    setCode(getCurrentFileContent());
  }, [currentFile, getCurrentFileContent]);
  
  // Update file content when code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    updateFileContent(currentFile, newCode);
  };

  const compileCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/compiler/compile', { code });
      setOutput(response.data.result);
    } catch (error) {
      setOutput({
        executionSuccess: false,
        logs: ['Error: Failed to compile code'],
        error: error.response?.data?.message || error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    // Set to empty string to display the placeholder
    setCode('');
    updateFileContent(currentFile, '');
    setOutput(null);
  };

  return (
    <div className="compiler-container">
      <div className="compiler-main">
        <Split 
          className="split-container"
          direction="horizontal"
          sizes={[50, 50]}
          minSize={150}
          gutterSize={8}
          gutterAlign="center"
        >
          <div className="editor-section">
            <CodeEditor code={code} setCode={handleCodeChange} />
          </div>
          
          <div className="output-section">
            <OutputPanel 
              output={output} 
              isLoading={isLoading} 
              onRun={compileCode}
              onClear={handleClear}
            />
          </div>
        </Split>
      </div>
    </div>
  );
};

export default Compiler;