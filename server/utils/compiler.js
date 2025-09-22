const acorn = require('acorn');
const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const { VM } = require('vm2');

/**
 * Parse JavaScript code to Abstract Syntax Tree (AST)
 * @param {string} code - JavaScript code to parse
 * @returns {Object} - AST representation of the code
 */
const parseJavaScript = (code) => {
  try {
    // Using esprima for more detailed parsing
    const ast = esprima.parseScript(code, { 
      loc: true, 
      range: true,
      tokens: true,
      comment: true
    });
    return ast;
  } catch (error) {
    throw new Error(`Parsing error: ${error.message}`);
  }
};

/**
 * Transform/optimize the AST (e.g., for optimizations, transpiling)
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {string} - Transformed JavaScript code
 */
const transformCode = (ast) => {
  try {
    // Example transformation: we could perform optimizations here
    // For now, we'll just do a simple AST traversal
    estraverse.traverse(ast, {
      enter: function(node) {
        // Here we could transform nodes as needed
        // For example, replace console.log with custom logging
      }
    });

    // Generate code from the (potentially transformed) AST
    return escodegen.generate(ast);
  } catch (error) {
    throw new Error(`Transformation error: ${error.message}`);
  }
};

/**
 * Safely execute JavaScript code and return the result
 * @param {string} code - JavaScript code to execute
 * @returns {Object} - Execution result
 */
const executeCode = (code) => {
  try {
    // Create a sandboxed environment using VM2
    const vm = new VM({
      timeout: 5000, // 5 second timeout
      sandbox: {
        console: {
          log: (...args) => {
            return args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
          },
          error: (...args) => {
            return args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
          }
        }
      }
    });

    // Capture console.log output
    let output = [];
    const modifiedCode = `
      const __originalConsoleLog = console.log;
      const __logs = [];
      
      console.log = function() {
        const args = Array.from(arguments);
        __logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '));
        __originalConsoleLog.apply(console, arguments);
      };
      
      try {
        ${code}
      } catch(e) {
        __logs.push("Error: " + e.message);
      }
      
      __logs;
    `;

    // Execute the code
    const result = vm.run(modifiedCode);
    
    return {
      logs: result,
      executionSuccess: true
    };
  } catch (error) {
    return {
      logs: [`Error: ${error.message}`],
      executionSuccess: false,
      error: error.message
    };
  }
};

module.exports = {
  parseJavaScript,
  transformCode,
  executeCode
};