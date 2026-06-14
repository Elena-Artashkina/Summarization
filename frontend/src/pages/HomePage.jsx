import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import HeaderNew from '../components/HeaderNew';
import FooterNew from '../components/FooterNew';

const HomePage = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Анализ текстов',
      description: 'Статистические показатели, облако слов и анализ частей речи. Визуализируйте ключевые слова и узнайте структуру вашего текста.',
      path: '/analysis',
      icon: '📊'
    },
    {
      title: 'СММ помощник',
      description: 'Рекомендации для ведения социальных сетей по ключевым словам, соответствующим законам РФ в сфере рекламы и ведения соц. сетей.',
      path: '/smm',
      icon: '📱'
    },
    {
      title: 'Суммаризация',
      description: 'Создание краткого содержания текстов. Использование модели машинного обучения позволит получать основные идеи текста.',
      path: '/summarization',
      icon: '📝'
    }
  ];

  return (
    <>
      {/* Фоновые круги */}
      <div className="shape-circle shape-circle-1"></div>
      <div className="shape-circle shape-circle-2"></div>
      <div className="shape-circle shape-circle-3"></div>
      <div className="shape-circle shape-circle-4"></div>
      <div className="shape-circle shape-circle-5"></div>
      <div className="dots"></div>

      <HeaderNew />
      <Box sx={{ 
        minHeight: 'calc(100vh - 64px)', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 3 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: '3.5rem',
              fontWeight: 800, 
              mb: 1,
            }}
          >
            смысл.txt
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              mb: 2,
              fontWeight: 400,
              color: 'var(--text-secondary)'
            }}
          >
            Сервис для анализа и обработки текстов
          </Typography>
          
          <Button 
            variant="contained" 
            size="medium"
            onClick={() => navigate('/analysis')}
            sx={{
              padding: '10px 36px',
              fontSize: '1rem',
              borderRadius: '40px',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Перейти к анализу
          </Button>
        </Container>

        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onClick={() => navigate(service.path)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3, px: 2 }}>
                    <Typography variant="h2" sx={{ fontSize: '2.5rem', mb: 1 }}>
                      {service.icon}
                    </Typography>
                    <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
                    <Button size="small" sx={{ background: 'transparent !important', boxShadow: 'none !important', '&:hover': { background: 'transparent !important', opacity: 0.7 } }}>
                      Подробнее →
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <FooterNew />
    </>
  );
};

export default HomePage;