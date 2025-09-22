# JavaScript Compiler

A modern, interactive JavaScript compiler built with the MERN stack featuring both dark and light themes with a sleek, responsive UI.

![JavaScript Compiler](https://img.shields.io/badge/JavaScript-Compiler-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Interactive Code Editor**: Write JavaScript with vibrant syntax highlighting
- **Live Output Panel**: See your code's output instantly
- **Themes**: Toggle between dark and light modes for comfortable coding
- **Mobile Responsive**: Optimized layout for both desktop and mobile devices
- **Secure Code Execution**: Run JavaScript code in a controlled environment
- **Clean UI/UX**: Intuitive interface with modern design

## 🛠️ Tech Stack

### Frontend
- **React.js**: For the user interface
- **React Icons**: For beautiful icons throughout the application
- **Custom CSS**: Fully custom styling with CSS variables for theming
- **Context API**: For state management (theme, files)
- **Custom Syntax Highlighter**: For vibrant code highlighting

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **JavaScript Execution**: Secure code compilation and execution

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/akshaymishra-0/javascript-compiler.git
cd javascript-compiler
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start the server**
```bash
# In the server directory
npm start
```

2. **Start the client**
```bash
# In the client directory
npm start
```

3. **Access the application**
Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
mern-js-compiler/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── CodeEditor.js   # Code editing component
│       │   ├── Navbar.js       # Navigation bar
│       │   ├── OutputPanel.js  # Results display panel
│       │   └── Sidebar.js      # File management sidebar
│       ├── context/        # React context providers
│       │   ├── FileContext.js  # File management state
│       │   └── ThemeContext.js # Theme state (dark/light)
│       ├── pages/          # Page components
│       │   └── Compiler.js     # Main compiler page
│       ├── styles/         # Component-specific CSS
│       └── utils/          
│           └── syntaxHighlighter.js # Custom syntax highlighting
├── server/                 # Express backend
│   ├── controllers/        # API logic
│   ├── routes/             # API endpoints
│   └── utils/              # Backend utilities
│       └── compiler.js     # Code execution engine
└── package.json            # Project metadata and scripts
```

## 📱 Mobile Support

The application is fully responsive and supports mobile devices of all sizes:

- Collapsible sidebar with toggle button
- Optimized spacing for mobile screens
- Touch-friendly controls
- Responsive editor and output panels

## 🎨 Themes

Switch seamlessly between:

- **Dark Theme**: Easy on the eyes for night coding sessions
- **Light Theme**: Perfect for daytime use with high contrast

## 📝 Usage Guide

1. **Creating a New File**:
   - Click the "+" button in the sidebar
   - Enter a file name (will automatically add .js extension if not provided)

2. **Running Code**:
   - Write your JavaScript code in the editor
   - Click the "Run" button in the output panel
   - See results instantly in the output area

3. **Changing Theme**:
   - Click the sun/moon icon in the navbar to toggle between light and dark modes

## 👨‍💻 Author

Akshay Mishra

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

Made with ❤️ and JavaScript