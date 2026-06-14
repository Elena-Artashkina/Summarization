import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '../context/ThemeContext';

const pages = [
  { name: 'Анализ текстов', path: '/analysis' },
  { name: 'СММ помощник', path: '/smm' },
  { name: 'Суммаризация', path: '/summarization' }
];

function HeaderNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElTheme, setAnchorElTheme] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenThemeMenu = (event) => {
    setAnchorElTheme(event.currentTarget);
  };

  const handleCloseThemeMenu = () => {
    setAnchorElTheme(null);
  };

  const handleThemeChange = (newTheme) => {
    if ((theme === 'light' && newTheme === 'dark') || (theme === 'dark' && newTheme === 'light')) {
      toggleTheme();
    }
    handleCloseThemeMenu();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'transparent !important',
        boxShadow: 'none',
        background: 'transparent !important',
        borderBottom: '1px solid',
        borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px', position: 'relative' }}>
          {/* Логотип и название - слева */}
          <Box 
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img 
              src="/Logo.png" 
              alt="Logo" 
              style={{ width: 32, height: 32, marginRight: 8 }} 
            />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: '1.25rem',
                letterSpacing: '.05rem',
                color: theme === 'light' ? '#1e293b' : '#ffffff',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              смысл.txt
            </Typography>
          </Box>

          {/* Десктопное меню - ПО ЦЕНТРУ */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            maxWidth: 'fit-content',
            gap: 3
          }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                sx={{ 
                  my: 2, 
                  mx: 2,
                  display: 'block',
                  fontWeight: isActive(page.path) ? 500 : 400,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, sans-serif',
                  color: theme === 'light' ? '#475569' : '#cbd5e1',
                  '&:hover': {
                    color: theme === 'light' ? '#1e293b' : '#ffffff',
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Переключатель темы - справа (иконки солнце и месяц) */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1
          }}>
            {/* Иконка солнца - светлая тема */}
            <Box
              onClick={() => theme !== 'light' && toggleTheme()}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === 'light' ? '#1e293b' : '#94a3b8',
                opacity: theme === 'light' ? 1 : 0.5,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 1,
                  color: theme === 'light' ? '#1e293b' : '#ffffff',
                }
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M22 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.07 19.07L17.66 17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Box>

            {/* Иконка месяца - темная тема */}
            <Box
              onClick={() => theme !== 'dark' && toggleTheme()}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === 'dark' ? '#ffffff' : '#94a3b8',
                opacity: theme === 'dark' ? 1 : 0.5,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: 1,
                  color: theme === 'dark' ? '#ffffff' : '#1e293b',
                }
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </Box>

          {/* Мобильное меню */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{ color: theme === 'light' ? '#475569' : '#cbd5e1' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ 
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: theme === 'light' ? '#ffffff' : '#1e293b',
                  borderRadius: '12px',
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => handleNavigate(page.path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                    }
                  }}
                >
                  <Typography textAlign="center" sx={{ color: theme === 'light' ? '#475569' : '#cbd5e1' }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem 
                onClick={() => toggleTheme()}
                sx={{
                  borderTop: `1px solid ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <Typography textAlign="center" sx={{ color: theme === 'light' ? '#475569' : '#cbd5e1' }}>
                  {theme === 'light' ? '🌙 Темная тема' : '☀️ Светлая тема'}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderNew;