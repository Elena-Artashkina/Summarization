import * as React from 'react';
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

const pages = ['Облако слов'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Функция для плавной прокрутки к секции облака слов
  const scrollToWordCloud = () => {
    const wordCloudSection = document.getElementById('wordcloud-section');
    if (wordCloudSection) {
      wordCloudSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
    handleCloseNavMenu();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'transparent !important',
        color: '#1f2937',
        boxShadow: 'none',
        background: 'transparent !important',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          {/* Логотип и название слева */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <img 
              src="/Logo.png" 
              alt="Logo" 
              style={{ width: 32, height: 32, marginRight: 8, marginLeft: 85 }} 
            />
            <Typography
              component="a"
              href="/summarize"
              sx={{
                fontFamily: "inherit",
                fontSize: '1.25rem',
                letterSpacing: '.1rem',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              смысл.txt
            </Typography>
          </Box>

          {/* Растягивающийся Box для отталкивания надписи вправо */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Надпись "Облако слов" справа с отступом */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            mr: 20, // 👈 ЭТОТ ОТСТУП ОТ ПРАВОГО КРАЯ (меняйте значения: 0, 1, 2, 3, 4, 5, 10, 20 и т.д.)
          }}>
            <Typography
              onClick={scrollToWordCloud}
              sx={{ 
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 400,
                cursor: 'pointer',
                fontFamily: "inherit",
                '&:hover': {
                  opacity: 0.8,
                }
              }}
            >
              Облако слов
            </Typography>
          </Box>

          {/* Мобильное меню */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{ color: '#ffffff' }}
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
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={scrollToWordCloud}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;