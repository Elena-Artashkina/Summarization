import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getPOSAnalysis } from '../api/summarize';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const POSAnalysisComponent = ({ text }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPOSAnalysis = async () => {
      if (!text || text.trim() === '') {
        setData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getPOSAnalysis(text);
        const distribution = result.pos_distribution || {};
        
        const chartData = Object.entries(distribution).map(([name, value]) => ({
          name,
          value: Math.round(value * 10) / 10,
        }));
        
        setData(chartData);
      } catch (err) {
        console.error('Ошибка при загрузке анализа частей речи:', err);
        setError('Не удалось загрузить анализ частей речи');
      } finally {
        setLoading(false);
      }
    };

    if (text && text.trim()) {
      fetchPOSAnalysis();
    }
  }, [text]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'white', 
          p: 1, 
          border: '1px solid #ccc', 
          borderRadius: '6px',
          boxShadow: 1
        }}>
          <Typography variant="caption" fontWeight="bold">
            {payload[0].name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {payload[0].value}%
          </Typography>
        </Box>
      );
    }
    return null;
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

  // Если нет данных
  if (data.length === 0) {
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
          Недостаточно данных. Введите больше текста.
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
      <Box sx={{ width: '100%', height: 320, position: 'relative' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={90}
              innerRadius={45}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '11px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default POSAnalysisComponent;