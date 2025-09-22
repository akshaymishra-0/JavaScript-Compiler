import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Compiler from './pages/Compiler';
import { useTheme } from './context/ThemeContext';
import { FileProvider } from './context/FileContext';
import './styles/App.css';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <FileProvider>
        <div className="main-container">
          <Sidebar />
          <div className="content">
            <Compiler />
          </div>
        </div>
      </FileProvider>
    </div>
  );
}

export default App;