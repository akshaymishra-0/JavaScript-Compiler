require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const compilerRoutes = require('./routes/compiler');

const app = express();
const PORT = process.env.PORT || 5050; // Changed to port 5050 to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/compiler', compilerRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const staticPath = path.join(__dirname, '../client/build');
  app.use(express.static(staticPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
  });
} else {
  // Base route for development
  app.get('/', (req, res) => {
    res.send('JavaScript Compiler API is running!');
  });
}

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for serverless functions
module.exports = app;