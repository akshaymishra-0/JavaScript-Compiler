import React from 'react';
import { FaPlay, FaCopy, FaTrash } from 'react-icons/fa';
import '../styles/OutputPanel.css';

const OutputPanel = ({ output, isLoading, onRun, onClear }) => {
  const copyToClipboard = () => {
    if (output && output.logs) {
      navigator.clipboard.writeText(output.logs.join('\n'));
    }
  };

  return (
    <div className="output-panel">
      <div className="output-panel-header">
        <h3>Output</h3>
        <div className="output-actions">
          <button 
            className="btn btn-primary" 
            onClick={onRun}
            disabled={isLoading}
          >
            <FaPlay /> {isLoading ? 'Running...' : 'Run'}
          </button>
          <button className="btn btn-secondary" onClick={copyToClipboard}>
            <FaCopy /> Copy
          </button>
          <button className="btn btn-danger" onClick={onClear}>
            <FaTrash /> Clear
          </button>
        </div>
      </div>
      <div className="output-content">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Compiling and executing code...</p>
          </div>
        ) : output ? (
          <>
            {output.executionSuccess === false && (
              <div className="error-box">
                <p>Execution Error</p>
                <pre className="error-message">{output.error}</pre>
              </div>
            )}
            <div className="output-logs">
              <p className="output-title">Console Output:</p>
              {output.logs && output.logs.length > 0 ? (
                <pre className="output-text">
                  {output.logs.map((log, index) => (
                    <div key={index} className="log-line">{log}</div>
                  ))}
                </pre>
              ) : (
                <p className="no-output">No output to display</p>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Run your code to see the output here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;