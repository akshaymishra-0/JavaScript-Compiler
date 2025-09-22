const express = require('express');
const { compileCode } = require('../controllers/compilerController');

const router = express.Router();

// Compile JavaScript code
router.post('/compile', compileCode);

module.exports = router;