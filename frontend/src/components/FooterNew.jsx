import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FooterNew = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const services = [
    { name: 'Анализ текстов', path: '/analysis' },
    { name: 'СММ помощник', path: '/smm' },
    { name: 'Суммаризация', path: '/summarization' }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Цвет подвала в зависимости от темы
  const footerBgColor = theme === 'light' ? '#e5e7eb' : '#1f2937';

  return (
    <Box
      sx={{
        backgroundColor: footerBgColor,
        borderTop: '1px solid var(--footer-border)',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: theme === 'light' ? '#374151' : '#f1f5f9', fontWeight: 700, mb: 2 }}>
            Все сервисы
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {services.map((service, index) => (
              <Typography
                key={index}
                onClick={() => handleNavigate(service.path)}
                sx={{
                  color: theme === 'light' ? '#4b5563' : '#cbd5e1',
                  cursor: 'pointer',
                  mb: 1,
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                {service.name}
              </Typography>
            ))}
          </Box>
          
          <Typography variant="body2" sx={{ color: theme === 'light' ? '#374151' : '#f1f5f9', mb: 1, fontWeight: 500 }}>
            смысл.txt - Сервис для анализа и обработки текстов
          </Typography>
          
        </Box>
      </Container>
    </Box>
  );
};

export default FooterNew;