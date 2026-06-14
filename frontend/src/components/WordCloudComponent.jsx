import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Slider, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { getWordCloud } from '../api/summarize';
import WordCloud from 'wordcloud';

const WordCloudComponent = ({ text }) => {
  const canvasRef = useRef(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 320 });
  const containerRef = useRef(null);
  
  const [settings, setSettings] = useState({
    color: 'random-dark',
    shape: 'circle',
    rotateRatio: 0.5,
    minSize: 12,
    maxSize: 45,
  });

  // Загружаем облако слов при изменении текста
  useEffect(() => {
    const fetchWordCloud = async () => {
      if (!text || text.trim() === '') {
        setWords([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getWordCloud(text);
        setWords(result.words || []);
      } catch (err) {
        console.error('Ошибка при загрузке облака слов:', err);
        setError('Не удалось загрузить облако слов');
      } finally {
        setLoading(false);
      }
    };

    if (text && text.trim()) {
      fetchWordCloud();
    }
  }, [text]);

  // Отслеживаем размер контейнера
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Рисуем облако слов
  useEffect(() => {
    if (!canvasRef.current || words.length === 0 || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    const wordArray = words.map(w => [w.text, w.value]);
    const maxWeight = words.length > 0 ? Math.max(...words.map(w => w.value)) : 1;
    
    const options = {
      list: wordArray,
      gridSize: 12,
      weightFactor: function(w) {
        const minSize = settings.minSize;
        const maxSize = settings.maxSize;
        if (maxWeight === 0) return minSize;
        return minSize + (w / maxWeight) * (maxSize - minSize);
      },
      fontFamily: 'Inter, sans-serif',
      color: settings.color,
      backgroundColor: 'transparent',
      rotateRatio: settings.rotateRatio,
      shape: settings.shape,
      shrinkToFit: true,
      weightMode: 'size',
      shuffle: false,
      ellipticity: 0.7,
      clearCanvas: true,
    };
    
    try {
      WordCloud(canvas, options);
    } catch (err) {
      console.error('Ошибка при генерации облака слов:', err);
    }
    
  }, [words, dimensions, settings]);

  const handleSizeChange = (event, newValue) => {
    setSettings(prev => ({ ...prev, minSize: newValue[0], maxSize: newValue[1] }));
  };

  const handleShapeChange = (event) => {
    setSettings(prev => ({ ...prev, shape: event.target.value }));
  };

  const handleColorChange = (event) => {
    setSettings(prev => ({ ...prev, color: event.target.value }));
  };

  const handleRotateChange = (event) => {
    setSettings(prev => ({ ...prev, rotateRatio: event.target.value }));
  };

  // Компонент для отображения, если нет текста
  if (!text || text.trim() === '') {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          textAlign: 'center',
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          backgroundColor: 'transparent'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Введите текст и нажмите "Анализировать"
        </Typography>
      </Paper>
    );
  }

  // Состояние загрузки
  if (loading) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          textAlign: 'center',
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          backgroundColor: 'transparent'
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          textAlign: 'center',
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          backgroundColor: 'transparent'
        }}
      >
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Paper>
    );
  }

  // Если нет слов
  if (words.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          textAlign: 'center',
          minHeight: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          backgroundColor: 'transparent'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Недостаточно слов для формирования облака. Введите больше текста.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        backgroundColor: 'transparent'
      }}
    >
      {/* Панель управления */}
      <Box sx={{ mb: 1.5, p: 1, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>
          Настройки:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ minWidth: 130 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
              Размер: {settings.minSize}px - {settings.maxSize}px
            </Typography>
            <Slider
              value={[settings.minSize, settings.maxSize]}
              onChange={handleSizeChange}
              valueLabelDisplay="auto"
              min={10}
              max={70}
              size="small"
              sx={{ width: 130 }}
            />
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel sx={{ fontSize: '0.7rem' }}>Форма</InputLabel>
            <Select
              value={settings.shape}
              label="Форма"
              onChange={handleShapeChange}
              size="small"
              sx={{ fontSize: '0.7rem', height: 32 }}
            >
              <MenuItem value="circle" sx={{ fontSize: '0.7rem' }}>Круг</MenuItem>
              <MenuItem value="square" sx={{ fontSize: '0.7rem' }}>Квадрат</MenuItem>
              <MenuItem value="diamond" sx={{ fontSize: '0.7rem' }}>Ромб</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel sx={{ fontSize: '0.7rem' }}>Цвета</InputLabel>
            <Select
              value={settings.color}
              label="Цвета"
              onChange={handleColorChange}
              size="small"
              sx={{ fontSize: '0.7rem', height: 32 }}
            >
              <MenuItem value="random-dark" sx={{ fontSize: '0.7rem' }}>Темные</MenuItem>
              <MenuItem value="random-light" sx={{ fontSize: '0.7rem' }}>Светлые</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel sx={{ fontSize: '0.7rem' }}>Поворот</InputLabel>
            <Select
              value={settings.rotateRatio}
              label="Поворот"
              onChange={handleRotateChange}
              size="small"
              sx={{ fontSize: '0.7rem', height: 32 }}
            >
              <MenuItem value={0} sx={{ fontSize: '0.7rem' }}>Горизонтально</MenuItem>
              <MenuItem value={0.5} sx={{ fontSize: '0.7rem' }}>Смешанный</MenuItem>
              <MenuItem value={1} sx={{ fontSize: '0.7rem' }}>Вертикально</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Canvas для облака слов */}
      <Box 
        ref={containerRef}
        sx={{ 
          width: '100%', 
          height: 320,
          position: 'relative',
          backgroundColor: 'transparent',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </Box>
    </Paper>
  );
};

export default WordCloudComponent;