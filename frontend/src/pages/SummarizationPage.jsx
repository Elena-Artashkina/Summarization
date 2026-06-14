// frontend/src/pages/SummarizationPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, CircularProgress } from '@mui/material';
import HeaderNew from '../components/HeaderNew';
import FooterNew from '../components/FooterNew';
import InputTextArea from '../components/summarization/InputTextArea';
import OutputTextArea from '../components/summarization/OutputTextArea';
import ButtonUploadFiles from '../components/summarization/ButtonUploadFiles';
import { startSummarize, checkSummarizeStatus } from '../api/summarize';
import { useTask } from '../api/TaskContext';
import { useTheme } from '../context/ThemeContext';

const SummarizationPage = () => {
  const [inputText, setInputText] = useState('');
  const [localSummary, setLocalSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [error, setError] = useState(null);
  const pollInterval = useRef(null);
  const { theme } = useTheme();
  
  // Используем глобальный контекст для сохранения задачи между вкладками
  const { 
    activeTask, 
    taskResult, 
    completedTaskInput,
    isLoading: taskLoading, 
    startTask, 
    clearTask 
  } = useTask();

  // Пробный текст для суммаризации
  const sampleText = `В начале июля, в чрезвычайно жаркое время, под вечер, один молодой человек вышел из своей каморки, которую нанимал от жильцов в С-м переулке, на улицу и медленно, как бы в нерешимости, отправился к К-ну мосту. Он благополучно избегнул встречи с своею хозяйкой на лестнице. Каморка его приходилась под самою кровлей высокого пятиэтажного дома и походила более на шкаф, чем на квартиру.`;

  // Определяем, какой результат показывать
  const summary = taskResult || localSummary;
  
  // Определяем, какой исходный текст показывать
  const displayInputText = completedTaskInput || inputText;

  // Остановка опроса при размонтировании компонента
  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  // Опрос статуса задачи (локальный, когда taskId есть)
  useEffect(() => {
    if (!taskId) return;

    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    pollInterval.current = setInterval(async () => {
      try {
        const status = await checkSummarizeStatus(taskId);
        
        if (status.status === 'completed') {
          setLocalSummary(status.result);
          setIsLoading(false);
          setTaskId(null);
          clearTask();
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        } else if (status.status === 'failed') {
          console.error('Ошибка:', status.error);
          setError(status.error || 'Ошибка при генерации резюме');
          setIsLoading(false);
          setTaskId(null);
          clearTask();
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        }
      } catch (err) {
        console.error('Ошибка проверки статуса:', err);
      }
    }, 1000);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [taskId, clearTask]);

  // Восстанавливаем состояние из глобального контекста при загрузке страницы
  useEffect(() => {
    if (activeTask) {
      setIsLoading(true);
      setTaskId(activeTask.taskId);
      setInputText(activeTask.inputText || '');
    }
    if (taskResult) {
      setLocalSummary(taskResult);
      setIsLoading(false);
    }
    // Если есть завершённая задача с исходным текстом, восстанавливаем его
    if (completedTaskInput && !inputText) {
      setInputText(completedTaskInput);
    }
  }, [activeTask, taskResult, completedTaskInput, inputText]);

  const handleFileUpload = (fileContent) => {
    setInputText(fileContent);
    setLocalSummary('');
    setError(null);
    clearTask();
    setTaskId(null);
    setIsLoading(false);
  };

  const handleSummarize = async () => {
    if (!inputText.trim() || isLoading || taskLoading) return;
    
    setIsLoading(true);
    setLocalSummary('');
    setError(null);
    clearTask();
    
    try {
      const result = await startSummarize(inputText);
      startTask(result.task_id, inputText);
      setTaskId(result.task_id);
    } catch (err) {
      console.error('Ошибка при запуске суммаризации:', err);
      setError('Произошла ошибка при запуске генерации резюме');
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setLocalSummary('');
    setError(null);
    clearTask();
    setTaskId(null);
    setIsLoading(false);
  };

  const handleInsertSample = () => {
    setInputText(sampleText);
    setLocalSummary('');
    setError(null);
    clearTask();
    setTaskId(null);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setLocalSummary('');
    setError(null);
    clearTask();
  };

  // Определяем, показывать ли загрузку
  const showLoading = isLoading || taskLoading || (activeTask && !taskResult);
  const linkColor = theme === 'light' ? '#6b7280' : '#ffffff';

  return (
    <>
      <HeaderNew />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4 }}>
        <Container maxWidth="xl">
          {/* Заголовок */}
          <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
            Суммаризация текста
          </Typography>
          
          {/* Подзаголовок */}
          <Typography variant="body1" sx={{ 
            mb: 4, 
            textAlign: 'center', 
            color: 'var(--text-primary)', 
            fontSize: '1rem', 
            lineHeight: 1.6,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            Вставьте текст и получите его краткое содержание
          </Typography>
          
          {error && (
            <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
                {error}
              </Box>
            </Box>
          )}
          
          {/* Кнопка загрузки файлов */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ButtonUploadFiles onTextExtracted={handleFileUpload} />
          </Box>
          
          {/* Форма ввода и вывода */}
          <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto', mb: 4 }}>
            <Grid item xs={12} md={6}>
              <InputTextArea 
                value={displayInputText}
                onChange={handleInputChange}
                placeholder="Введите или вставьте текст для суммаризации..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <OutputTextArea 
                summary={summary}
                loading={showLoading}
                onSummaryChange={setLocalSummary}
              />
            </Grid>
          </Grid>
          
          {/* Кнопка суммаризации */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={handleSummarize}
              disabled={!inputText.trim() || showLoading}
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
              {showLoading ? 'Обработка...' : 'Суммаризировать'}
            </Button>
          </Box>

          {/* Ссылки под кнопкой - справа, друг под другом */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '1200px', mx: 'auto', mb: 5 }}>
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

          {/* Описание сервиса */}
          <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'var(--text-primary)', fontWeight: 600, textAlign: 'left' }}>
              О сервисе
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.8, mb: 2, textAlign: 'left' }}>
              <strong>Суммаризация текста</strong> — это процесс создания краткого содержания исходного текста с сохранением основных мыслей и ключевой информации. Сервис использует модель машинного обучения для автоматической обработки текста и выделения самого важного.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7, mb: 2, textAlign: 'left' }}>
              <strong>Как это работает:</strong> Вы вставляете текст в поле слева (или загружаете файл формата .txt), нажимаете кнопку «Суммаризировать», и через некоторое время получаете краткое содержание справа.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7, mb: 2, textAlign: 'left' }}>
              <strong>Когда это полезно:</strong> Суммаризация помогает быстро ознакомиться с содержанием статей, научных работ, новостей или документации. Экономит время при подготовке к экзаменам, написании обзоров или анализе больших объёмов информации.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7, textAlign: 'left' }}>
              <strong>Поддерживаемые языки:</strong> Русский и английский. Сервис автоматически определяет язык текста и адаптирует обработку под его особенности.
            </Typography>
          </Box>
        </Container>
      </Box>
      <FooterNew />
    </>
  );
};

export default SummarizationPage;