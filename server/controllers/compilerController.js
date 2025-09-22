const { parseJavaScript, executeCode, transformCode } = require('../utils/compiler');

/**
 * Compile JavaScript code
 * @route POST /api/compiler/compile
 */
const compileCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'No code provided' 
      });
    }

    // Parse JavaScript code using AST
    const parsedCode = parseJavaScript(code);
    
    // Transform code if needed (optimization, etc.)
    const transformedCode = transformCode(parsedCode);
    
    // Execute code and get result
    const result = executeCode(code);

    // Get AST structure for visualization
    const ast = JSON.stringify(parsedCode, null, 2);

    return res.status(200).json({
      success: true,
      result,
      ast,
      transformedCode
    });
  } catch (error) {
    console.error('Compilation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error compiling code',
      error: error.stack
    });
  }
};

module.exports = {
  compileCode
};