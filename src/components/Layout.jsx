// src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';

const Layout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      color: 'var(--text-h)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1126px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>📋 Invoice App</h1>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={toggleTheme}
            style={{ borderRadius: '50px', padding: '8px 16px' }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </Button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '0 24px 40px', maxWidth: '1126px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;