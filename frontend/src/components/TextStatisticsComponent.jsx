import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import { getTextStats } from '../api/summarize';

const TextStatisticsComponent = ({ text }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!text || text.trim() === '') {
        setStats(null);
        return;
      }

      setLoading(true);
      try {
        const result = await getTextStats(text);
        setStats(result);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchStats();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [text]);

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Загрузка статистики...
        </Typography>
      </Paper>
    );
  }

  if (!stats || stats.word_count === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Введите текст и нажмите "Анализировать"
        </Typography>
      </Paper>
    );
  }

  // Разбор топ-5 слов для отображения в виде чипсов
  const topWordsList = stats.top_words || [];

  // Блок 1: Базовая статистика
  const basicStats = [
    { label: 'Количество слов', value: stats.word_count.toLocaleString() },
    { label: 'Количество символов (с пробелами)', value: stats.char_count.toLocaleString() },
    { label: 'Количество символов (без пробелов)', value: stats.char_count_no_spaces.toLocaleString() },
    { label: 'Количество предложений', value: stats.sentence_count },
    { label: 'Количество абзацев', value: stats.paragraph_count },
  ];

  // Блок 2: Лексическое разнообразие
  const lexicalStats = [
    { label: 'Уникальных слов', value: stats.unique_words.toLocaleString() },
    { label: 'Лексическое разнообразие', value: `${stats.lexical_diversity}%` },
    { 
      label: 'Топ-5 частых слов', 
      value: (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {topWordsList.length > 0 ? (
            topWordsList.map((item, idx) => (
              <Chip
                key={idx}
                label={`${item.word} (${item.count})`}
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                  }
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">-</Typography>
          )}
        </Box>
      ) 
    },
  ];

  // Блок 3: Структура текста
  const structureStats = [
    { label: 'Средняя длина слова', value: `${stats.avg_word_length} букв` },
    { label: 'Средняя длина предложения', value: `${stats.avg_sentence_length} слов` },
  ];

  // Блок 4: Читаемость и сложность
  const readabilityStats = [
    { label: 'Время чтения', value: stats.reading_time },
    { label: 'Уровень сложности', value: stats.difficulty_level },
    { label: 'Индекс удобочитаемости Флеша', value: `${stats.flesch_index}%` },
  ];

  const renderTableSection = (title, data) => (
    <>
      <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
        <TableCell colSpan={2} sx={{ py: 1.5, fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
          {title}
        </TableCell>
      </TableRow>
      {data.map((item, index) => (
        <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
          <TableCell sx={{ width: '45%', color: 'var(--text-primary)', fontSize: '1rem', py: 1.5 }}>
            {item.label}
          </TableCell>
          <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1rem', py: 1.5 }}>
            {item.value}
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2, color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid var(--card-border)', fontSize: '1.3rem' }}>
        Статистика текста
      </Typography>
      
      <Table sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid var(--card-border)' } }}>
        <TableBody>
          {renderTableSection('Базовая статистика', basicStats)}
          {renderTableSection('Лексическое разнообразие', lexicalStats)}
          {renderTableSection('Структура текста', structureStats)}
          {renderTableSection('Читаемость и сложность', readabilityStats)}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TextStatisticsComponent;