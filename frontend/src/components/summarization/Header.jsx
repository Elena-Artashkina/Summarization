// import * as React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';

// const pages = ['Theme', 'RU'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function ResponsiveAppBar() {
//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'black' }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'inherit' }} />
//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               //fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.1rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             Summary.AI
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ display: { xs: 'block', md: 'none' } }}
//             >
//               {pages.map((page) => (
//                 <MenuItem key={page} onClick={handleCloseNavMenu}>
//                   <Typography sx={{ textAlign: 'center', color: 'black' }}>{page}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//           <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'inherit' }} />
//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
            
//           </Typography>
//           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//             {pages.map((page) => (
//               <Button
//                 key={page}
//                 onClick={handleCloseNavMenu}
//                 sx={{ my: 2, color: 'black', display: 'block' }}
//               >
//                 {page}
//               </Button>
//             ))}
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
// export default ResponsiveAppBar;


import * as React from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
import AdbIcon from '@mui/icons-material/Adb';

function ResponsiveAppBar() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  // Функция для открытия меню навигации
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Функция для закрытия меню навигации
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Настройки темы
  const themeSettings = {
    name: theme === 'light' ? 'Dark Mode' : 'Light Mode',
    icon: theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />,
    action: () => {
      toggleTheme();
      handleCloseNavMenu();
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'var(--appbar-bg)', 
        color: 'var(--appbar-text)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Логотип для десктопа */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'inherit' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Summary.AI
          </Typography>

          {/* Мобильное меню */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={themeSettings.action}>
                {themeSettings.icon}
                <Typography sx={{ ml: 1 }}>{themeSettings.name}</Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Логотип для мобильных */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'inherit' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Summary.AI
          </Typography>

          {/* Десктопное меню */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              startIcon={themeSettings.icon}
              onClick={toggleTheme}
              sx={{ 
                my: 2, 
                color: 'inherit'
              }}
            >
              {themeSettings.name}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;