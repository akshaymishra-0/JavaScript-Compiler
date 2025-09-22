import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { highlightJavaScript } from '../utils/syntaxHighlighter';
import '../styles/CodeEditor.css';

const CodeEditor = ({ code, setCode }) => {
  const { theme } = useTheme();
  const [lineCount, setLineCount] = useState(1);
  const [highlightedCode, setHighlightedCode] = useState('');
  const textareaRef = useRef(null);
  const displayRef = useRef(null);
  
  // Mapping of closing characters to check for auto-skip
  const closingChars = {
    ')': '(',
    ']': '[',
    '}': '{',
    '"': '"',
    "'": "'",
    '`': '`'
  };
  
  // Calculate line numbers and update highlighted code when code changes
  useEffect(() => {
    if (code) {
      const lines = code.split('\n').length || 1;
      setLineCount(lines);
      setHighlightedCode(highlightJavaScript(code));
    } else {
      // For empty content, ensure we at least have one line number
      setLineCount(1);
      setHighlightedCode('');
    }
  }, [code]);
  
  // Sync scrolling between textarea and highlighted display
  useEffect(() => {
    const textarea = textareaRef.current;
    const display = displayRef.current;
    
    if (textarea && display) {
      const handleScroll = () => {
        display.scrollTop = textarea.scrollTop;
        display.scrollLeft = textarea.scrollLeft;
      };
      
      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle tab key press and auto-pairing of characters
  const handleKeyDown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const hasSelection = start !== end;
    
    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Insert tab at cursor position
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
      return;
    }
    
    // Auto-completion for paired characters
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
      ';': ''  // semicolon doesn't need a pair, but we include it for consistency
    };
    
    // Handle auto-skip for closing characters
    if (closingChars[e.key] && !hasSelection) {
      const nextChar = code.charAt(start);
      
      // If the next character is the same as what we're trying to type
      // and we have a matching opening character somewhere before, just skip over it
      if (nextChar === e.key) {
        e.preventDefault();
        // Move cursor past the existing closing character
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 1;
        }, 0);
        return;
      }
    }
    
    if (pairs.hasOwnProperty(e.key)) {
      e.preventDefault();
      
      let insertText = e.key;
      let cursorOffset = 1;
      
      // For all pairs except semicolons, add the closing character
      if (e.key !== ';') {
        insertText += pairs[e.key];
        // Don't move cursor for semicolons
      }
      
      if (hasSelection) {
        // Wrap the selection with the pair
        const newValue = code.substring(0, start) + e.key + code.substring(start, end) + 
                        (e.key !== ';' ? pairs[e.key] : '') + code.substring(end);
        setCode(newValue);
        
        // Keep the selection wrapped by the new characters
        setTimeout(() => {
          e.target.selectionStart = start + 1;
          e.target.selectionEnd = end + 1;
        }, 0);
      } else {
        // No selection, just insert the pair
        const newValue = code.substring(0, start) + insertText + code.substring(end);
        setCode(newValue);
        
        // Position cursor between the pair (except for semicolons)
        setTimeout(() => {
          if (e.key !== ';') {
            e.target.selectionStart = e.target.selectionEnd = start + 1;
          } else {
            e.target.selectionStart = e.target.selectionEnd = start + cursorOffset;
          }
        }, 0);
      }
      return;
    }
    
    // Handle backspace to delete pairs together when cursor is between them
    if (e.key === 'Backspace' && start === end) {
      // Check if there's only one character left and user is trying to delete it
      if (code.length === 1 && start === 1) {
        e.preventDefault();
        setCode('');
        return;
      }
      
      // Regular pair deletion
      if (start > 0) {
        const prevChar = code.charAt(start - 1);
        const nextChar = code.charAt(start);
        
        // Check if cursor is between a matching pair
        const isPair = (prevChar === '(' && nextChar === ')') ||
                      (prevChar === '[' && nextChar === ']') ||
                      (prevChar === '{' && nextChar === '}') ||
                      (prevChar === '"' && nextChar === '"') ||
                      (prevChar === "'" && nextChar === "'") ||
                      (prevChar === '`' && nextChar === '`');
        
        if (isPair) {
          e.preventDefault();
          const newValue = code.substring(0, start - 1) + code.substring(start + 1);
          setCode(newValue);
          
          // Position cursor where the pair was
          setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = start - 1;
          }, 0);
        }
      }
    }
    
    // Handle Enter key for auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = code.indexOf('\n', start);
      const currentLine = lineEnd >= 0 ? code.substring(lineStart, lineEnd) : code.substring(lineStart);
      
      // Calculate indentation of current line
      let indentation = '';
      for (let i = 0; i < currentLine.length; i++) {
        if (currentLine[i] === ' ' || currentLine[i] === '\t') {
          indentation += currentLine[i];
        } else {
          break;
        }
      }
      
      // Check if cursor is between braces or brackets to add extra indentation
      const prevChar = code.charAt(start - 1);
      const nextChar = code.charAt(start);
      let extraIndent = '';
      
      if ((prevChar === '{' && nextChar === '}') || 
          (prevChar === '[' && nextChar === ']') || 
          (prevChar === '(' && nextChar === ')')) {
        extraIndent = '    '; // Add 4 spaces of extra indentation
        
        // Create a new line with proper indentation and another for closing brace
        const newValue = 
          code.substring(0, start) + 
          '\n' + indentation + extraIndent + 
          '\n' + indentation + 
          code.substring(start);
          
        setCode(newValue);
        
        // Place cursor at the indented position
        setTimeout(() => {
          const newPos = start + 1 + indentation.length + extraIndent.length;
          e.target.selectionStart = e.target.selectionEnd = newPos;
        }, 0);
      } else {
        // Normal enter key behavior with indentation preservation
        const newValue = code.substring(0, start) + '\n' + indentation + code.substring(end);
        setCode(newValue);
        
        // Place cursor at the indented position on the new line
        setTimeout(() => {
          const newPos = start + 1 + indentation.length;
          e.target.selectionStart = e.target.selectionEnd = newPos;
        }, 0);
      }
    }
  };

  // Generate line numbers
  const renderLineNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= lineCount; i++) {
      numbers.push(<div key={i} className="line-number">{i}</div>);
    }
    return numbers;
  };

  return (
    <div className="code-editor-container">
      <div className={`custom-editor ${theme}`}>
        <div className="line-numbers">
          {renderLineNumbers()}
        </div>
        <div className="editor-content">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className="code-input"
            spellCheck="false"
            wrap="off"
            placeholder="// Write your JavaScript code here"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.5, caretColor: theme === 'dark' ? '#fff' : '#000', color: theme === 'dark' ? '#fff' : '#000' }}
          />
          <pre 
            ref={displayRef}
            className="code-display"
            dangerouslySetInnerHTML={{ 
              __html: code === '' 
                ? '<span class="placeholder">// Write your JavaScript code here</span>' 
                : (highlightedCode || escapeHtml(code)) 
            }}
          />
        </div>
      </div>
    </div>
  );
  
  // Helper function to escape HTML
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

export default CodeEditor;