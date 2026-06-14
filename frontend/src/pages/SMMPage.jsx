// frontend/src/pages/SMMPage.jsx
import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import HeaderNew from '../components/HeaderNew';
import FooterNew from '../components/FooterNew';
import InputTextArea from '../components/summarization/InputTextArea';
import SMMLegalCheck from '../components/SMMLegalCheck';
import { getSMMLegalCheck } from '../api/summarize';
import { useTheme } from '../context/ThemeContext';

const SMMPage = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // Пробный текст для проверки (содержит типичные нарушения)
  const sampleText = `Летом кожа лица требует особой заботы и ухода. Каждый день я использую крем Сияние для увлажнения и защиты от солнца.
До конца июля действует акция на использования Сияния в 30 процентов, успейте приобрести выгодно и с пользой.`;

  const handleCheck = async () => {
    if (!inputText || !inputText.trim()) return;

    setLoading(true);
    try {
      const data = await getSMMLegalCheck(inputText);
      setResult(data);
    } catch (err) {
      console.error('Ошибка при проверке:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  const handleInsertSample = () => {
    setInputText(sampleText);
    setResult(null);
  };

  const linkColor = theme === 'light' ? '#6b7280' : '#ffffff';

  const lawSections = [
    {
      number: "01",
      icon: "🏷️",
      title: "Маркировка рекламы",
      law: "ст. 18.1 ФЗ №38",
      description: "Рекламные посты требуют маркировки «Реклама» или «#реклама»",
      penalty: "до 500 000 ₽"
    },
    {
      number: "02",
      icon: "📢",
      title: "Запрещённые слова",
      law: "ч. 1 ст. 5 ФЗ №38",
      description: "Нельзя использовать «лучший», «уникальный», «гарантия» без доказательств",
      penalty: "до 500 000 ₽"
    },
    {
      number: "03",
      icon: "🍺",
      title: "Ограниченные категории",
      law: "ст. 21 ФЗ №171, ст. 23 ФЗ №15",
      description: "Алкоголь, табак, лекарства, БАДы, криптовалюта — строгие ограничения",
      penalty: "до 1 000 000 ₽"
    },
    {
      number: "04",
      icon: "🔒",
      title: "Персональные данные",
      law: "152-ФЗ",
      description: "Нельзя собирать паспорта, телефоны, СНИЛС без согласия",
      penalty: "до 1 500 000 ₽"
    },
    {
      number: "05",
      icon: "⚖️",
      title: "Оскорбления и клевета",
      law: "ст. 5.61 КоАП РФ, ст. 128.1 УК РФ",
      description: "Нецензурная лексика и оскорбления запрещены",
      penalty: "до 100 000 ₽ / до 3 000 000 ₽"
    },
    {
      number: "06",
      icon: "💰",
      title: "Финансовые услуги",
      law: "ст. 15.44 КоАП РФ",
      description: "Требуется лицензия ЦБ РФ и раскрытие полной стоимости",
      penalty: "до 1 000 000 ₽"
    }
  ];

  return (
    <>
      <HeaderNew />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
            ⚖️ СММ помощник — Рекомендации для ведения социальных сетей
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4, 
            textAlign: 'center', 
            color: 'var(--text-secondary)', 
            fontSize: '1rem',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            Проверьте ваш пост на соответствие законам РФ по ключевым словам.
            Сервис выявит совпадения, подскажет требования к маркировке и сформулирует рекомендации для корректировки.
          </Typography>

          {/* Форма ввода текста */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 4, border: '1px solid var(--card-border)', boxShadow: 'none', bgcolor: 'transparent' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
              📝 Введите текст поста
            </Typography>
            <InputTextArea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Вставьте текст поста для юридической проверки..."
            />
            
            {/* Кнопка проверки */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleCheck}
                disabled={!inputText?.trim() || loading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#ffffff',
                  padding: '10px 48px',
                  fontSize: '1rem',
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                  },
                  '&:disabled': {
                    background: '#94a3b8',
                    transform: 'none',
                  }
                }}
              >
                {loading ? 'Проверка...' : 'Проверить пост'}
              </Button>
            </Box>
            
            {/* Ссылки под кнопкой - справа, друг под другом */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Typography
                  onClick={handleInsertSample}
                  sx={{
                    color: linkColor,
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.7,
                    }
                  }}
                >
                  Вставить пробный текст
                </Typography>
                <Typography
                  onClick={handleClear}
                  sx={{
                    color: linkColor,
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.7,
                    }
                  }}
                >
                  Очистить
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Результат проверки - в рамке */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            mb: 5, 
            border: '1px solid var(--card-border)', 
            bgcolor: 'transparent'
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)' }}>
              📋 Результат проверки
            </Typography>
            <SMMLegalCheck 
              text={inputText} 
              result={result}
              loading={loading}
            />
          </Paper>

          {/* Описание сервиса */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
              Что нужно знать о рекламе в соцсетях
            </Typography>
            
            <Grid container spacing={2}>
              {lawSections.map((section) => (
                <Grid item xs={12} sm={6} md={4} key={section.number}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderLeft: `3px solid #667eea`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                        {section.number}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                        {section.law}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                      {section.icon} {section.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1, fontSize: '0.85rem' }}>
                      {section.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 500 }}>
                      Штраф: {section.penalty}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ 
              mt: 4, 
              p: 3, 
              bgcolor: 'rgba(102, 126, 234, 0.05)', 
              borderRadius: 3,
              border: '1px solid rgba(102, 126, 234, 0.15)',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                ⚠️ Сервис носит информационный характер и не является юридической консультацией. 
                При серьёзных вопросах рекомендуем обращаться к профессиональным юристам.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <FooterNew />
    </>
  );
};

export default SMMPage;