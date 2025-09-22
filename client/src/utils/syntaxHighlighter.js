/**
 * Simple JavaScript syntax highlighter
 */

// Keywords in JavaScript
const keywords = [
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 
  'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 
  'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 
  'interface', 'let', 'new', 'null', 'package', 'private', 'protected', 'public', 
  'return', 'super', 'switch', 'static', 'this', 'throw', 'true', 'try', 'typeof', 
  'var', 'void', 'while', 'with', 'yield'
];

// Built-in objects and methods
const builtIns = [
  'Array', 'Boolean', 'Date', 'Error', 'Function', 'JSON', 'Math', 'Number', 
  'Object', 'Promise', 'RegExp', 'String', 'console', 'document', 'window',
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'localStorage',
  'sessionStorage', 'fetch', 'parseInt', 'parseFloat'
];

/**
 * Highlights JavaScript code
 * @param {string} code - The code to highlight
 * @returns {string} HTML with highlighting spans
 */
export function highlightJavaScript(code) {
  if (!code) return '';
  
  // Escape HTML special characters
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Pre-process the code to identify function calls
  let funcCalls = [];
  const funcRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  let match;
  while ((match = funcRegex.exec(code)) !== null) {
    // Check if it's not a keyword
    if (!keywords.includes(match[1])) {
      funcCalls.push(match[1]);
    }
  }
  
  // Special handling for block comments
  code = code.replace(/\/\*[\s\S]*?\*\//g, match => {
    return match.split('\n').map(line => `<span class="syntax-comment">${escapeHtml(line)}</span>`).join('\n');
  });
  
  // Process the code line by line for better rendering
  const lines = code.split('\n');
  const processedLines = lines.map(line => {
    // Skip processing if the entire line is already a comment span
    if (line.startsWith('<span class="syntax-comment">')) {
      return line;
    }
    
    let processed = '';
    let tokens = [];
    let currentToken = '';
    let i = 0;
    
    // First pass: tokenize the line
    while (i < line.length) {
      const char = line[i];
      
      // Comment (rest of the line is a comment)
      if (char === '/' && line[i + 1] === '/') {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        tokens.push({ type: 'comment', value: line.substring(i) });
        break;
      }
      
      // String literals
      if (char === '"' || char === "'" || char === '`') {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        
        const stringChar = char;
        let stringValue = char;
        let j = i + 1;
        
        while (j < line.length) {
          stringValue += line[j];
          if (line[j] === stringChar && line[j - 1] !== '\\') {
            break;
          }
          j++;
        }
        
        tokens.push({ type: 'string', value: stringValue });
        i = j + 1;
        continue;
      }
      
      // Word boundary
      if (/[\s\(\)\{\}\[\]\;\,\.\+\-\*\/\%\=\!\<\>\?\:\&\|\^\~]/.test(char)) {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        
        // Numbers
        if (/[0-9]/.test(char) && (i === 0 || /[\s\(\[\{\,\;\=\+\-\*\/\%]/.test(line[i - 1]))) {
          let numValue = char;
          let j = i + 1;
          
          while (j < line.length && /[0-9\.]/.test(line[j])) {
            numValue += line[j];
            j++;
          }
          
          if (/^[0-9]+(\.[0-9]+)?$/.test(numValue)) {
            tokens.push({ type: 'number', value: numValue });
            i = j;
            continue;
          }
        }
        
        // Operators
        if (/[\+\-\*\/\%\=\!\<\>\?\:\&\|\^\~]/.test(char)) {
          tokens.push({ type: 'operator', value: char });
        } else {
          tokens.push({ type: 'text', value: char });
        }
        
        i++;
        continue;
      }
      
      // Build token
      currentToken += char;
      i++;
    }
    
    // Add any remaining token
    if (currentToken) {
      tokens.push({ type: 'text', value: currentToken });
    }
    
    // Second pass: classify and colorize tokens
    tokens.forEach(token => {
      if (token.type === 'text') {
        // Keywords
        if (keywords.includes(token.value)) {
          processed += `<span class="syntax-keyword">${escapeHtml(token.value)}</span>`;
        }
        // Built-ins
        else if (builtIns.includes(token.value)) {
          processed += `<span class="syntax-builtin">${escapeHtml(token.value)}</span>`;
        }
        // Function calls
        else if (funcCalls.includes(token.value)) {
          processed += `<span class="syntax-function">${escapeHtml(token.value)}</span>`;
        }
        // Regular text
        else {
          processed += escapeHtml(token.value);
        }
      }
      else if (token.type === 'string') {
        processed += `<span class="syntax-string">${escapeHtml(token.value)}</span>`;
      }
      else if (token.type === 'comment') {
        processed += `<span class="syntax-comment">${escapeHtml(token.value)}</span>`;
      }
      else if (token.type === 'number') {
        processed += `<span class="syntax-number">${escapeHtml(token.value)}</span>`;
      }
      else if (token.type === 'operator') {
        processed += `<span class="syntax-operator">${escapeHtml(token.value)}</span>`;
      }
      else {
        processed += escapeHtml(token.value);
      }
    });
    
    return processed;
  });
  
  // Join the lines back together
  return processedLines.join('\n');
}