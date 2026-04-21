// src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div style={{
      backgroundColor: isDarkMode ? '#141625' : '#F8F8FB',
      color: isDarkMode ? '#FFFFFF' : '#0C0E16',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>📋 Invoice App</h1>
        </Link>
        
        <button 
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: isDarkMode ? '#252945' : '#FFFFFF',
            color: isDarkMode ? '#FFFFFF' : '#7E88C3',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;