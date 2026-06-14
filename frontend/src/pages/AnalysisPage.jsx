import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import HeaderNew from '../components/HeaderNew';
import FooterNew from '../components/FooterNew';
import WordCloudComponent from '../components/WordCloudComponent';
import POSAnalysisComponent from '../components/PartOfSpeechAnalysis.jsx';
import TextStatisticsComponent from '../components/TextStatisticsComponent';
import InputTextArea from '../components/summarization/InputTextArea';
import ButtonUploadFiles from '../components/summarization/ButtonUploadFiles';
import { useTheme } from '../context/ThemeContext';
import { getWordCloud, getPOSAnalysis, getTextStats } from '../api/summarize';

const AnalysisPage = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const { theme } = useTheme();

  const handleFileUpload = (fileContent) => {
    setInputText(fileContent);
    setIsAnalyzed(false);
  };

  const handleAnalyze = () => {
    if (inputText.trim()) {
      setIsAnalyzed(true);
    }
  };

  const handleClear = () => {
    setInputText('');
    setIsAnalyzed(false);
  };

  const handleInsertSample = () => {
    const sampleText = `Вот уже несколько лет я живу в Петербурге, и каждый день, проходя по Невскому проспекту, я вспоминаю слова Гоголя о том, что нет ничего лучше этого проспекта. Он составляет всеобщую коммуникацию Петербурга. Здесь житель Петербурга, не имеющий надобности ехать на Выборгскую сторону или в Петергоф, может наслаждаться своим досугом. На Невском проспекте всё дышит обманом. Когда я иду по Невскому проспекту, я всегда чувствую, что нахожусь в каком-то особенном мире, где всё не то, чем кажется. Проходя мимо бесчисленных магазинов, я часто останавливаюсь перед одним из них, где продаются разные безделушки, и думаю о том, как много людей приходят сюда, чтобы потратить свои деньги на ненужные вещи. А вечером Невский проспект преображается. Фонари зажигаются, и всё вокруг начинает сиять и переливаться. Зимой, когда снег покрывает улицы, проспект становится особенно красивым. Я люблю гулять по нему поздним вечером, когда город засыпает, и только редкие прохожие спешат по своим делам. В такие моменты кажется, что ты находишься в каком-то волшебном сне, который вот-вот закончится.`;

    setInputText(sampleText);
    setIsAnalyzed(false);
  };

  const handleDownload = async () => {
    if (!inputText.trim()) return;

    try {
      const [wordCloudData, posData, statsData] = await Promise.all([
        getWordCloud(inputText),
        getPOSAnalysis(inputText),
        getTextStats(inputText)
      ]);

      const reportDate = new Date().toLocaleString('ru-RU');
      
      let reportContent = `╔════════════════════════════════════════════════════════════════╗\n`;
      reportContent += `║                    АНАЛИЗ ТЕКСТА                               ║\n`;
      reportContent += `║                   "Смысл.txt"                                  ║\n`;
      reportContent += `╚════════════════════════════════════════════════════════════════╝\n\n`;
      reportContent += `Дата анализа: ${reportDate}\n`;
      reportContent += `Длина текста: ${inputText.length} символов\n`;
      reportContent += `═══════════════════════════════════════════════════════════════\n\n`;

      reportContent += `📊 СТАТИСТИКА ТЕКСТА\n`;
      reportContent += `${'─'.repeat(50)}\n`;
      reportContent += `Количество слов: ${statsData.word_count?.toLocaleString() || 0}\n`;
      reportContent += `Количество символов (с пробелами): ${statsData.char_count?.toLocaleString() || 0}\n`;
      reportContent += `Количество символов (без пробелов): ${statsData.char_count_no_spaces?.toLocaleString() || 0}\n`;
      reportContent += `Количество предложений: ${statsData.sentence_count || 0}\n`;
      reportContent += `Количество абзацев: ${statsData.paragraph_count || 0}\n`;
      reportContent += `Уникальных слов: ${statsData.unique_words?.toLocaleString() || 0}\n`;
      reportContent += `Лексическое разнообразие: ${statsData.lexical_diversity || 0}%\n`;
      reportContent += `Средняя длина слова: ${statsData.avg_word_length || 0} букв\n`;
      reportContent += `Средняя длина предложения: ${statsData.avg_sentence_length || 0} слов\n`;
      reportContent += `Время чтения: ${statsData.reading_time || '0 сек'}\n`;
      reportContent += `Уровень сложности: ${statsData.difficulty_level || 'Нет данных'}\n`;
      reportContent += `Индекс удобочитаемости Флеша: ${statsData.flesch_index || 0}%\n\n`;

      reportContent += `🏆 ТОП-5 САМЫХ ЧАСТЫХ СЛОВ\n`;
      reportContent += `${'─'.repeat(50)}\n`;
      if (statsData.top_words && statsData.top_words.length > 0) {
        statsData.top_words.forEach((item, idx) => {
          reportContent += `${idx + 1}. ${item.word} — ${item.count} раз(а)\n`;
        });
      } else {
        reportContent += `Нет данных\n`;
      }
      reportContent += `\n`;

      reportContent += `☁️ ОБЛАКО СЛОВ (ключевые слова)\n`;
      reportContent += `${'─'.repeat(50)}\n`;
      if (wordCloudData.words && wordCloudData.words.length > 0) {
        wordCloudData.words.slice(0, 30).forEach((item, idx) => {
          reportContent += `${idx + 1}. ${item.text} — ${item.value} раз(а)\n`;
        });
      } else {
        reportContent += `Нет данных\n`;
      }
      reportContent += `\n`;

      reportContent += `📚 АНАЛИЗ ЧАСТЕЙ РЕЧИ\n`;
      reportContent += `${'─'.repeat(50)}\n`;
      if (posData.pos_distribution && Object.keys(posData.pos_distribution).length > 0) {
        Object.entries(posData.pos_distribution).forEach(([pos, percent]) => {
          reportContent += `${pos}: ${percent}%\n`;
        });
      } else {
        reportContent += `Нет данных\n`;
      }
      reportContent += `\n`;

      reportContent += `═══════════════════════════════════════════════════════════════\n`;
      reportContent += `Отчет сгенерирован сервисом "Смысл.txt"\n`;

      const blob = new Blob([reportContent], { type: 'text/plain; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `анализ_текста_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
    }
  };

  const linkColor = theme === 'light' ? '#6b7280' : '#ffffff';

  return (
    <>
      <HeaderNew />
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
            Анализ текстов
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4, 
            textAlign: 'left', 
            color: 'var(--text-primary)', 
            fontSize: '1rem', 
            lineHeight: 1.6,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            Смысл.txt позволяет анализировать текст путем формирования облака слов, расчета частей речи и статистических показателей, включающих количество слов, символов, предложений, уникальных слов, процент лексического разнообразия, среднюю длину слова и предложения, примерное время чтения, индекс Флеша и другие показатели.
          </Typography>
          
          <Box sx={{ maxWidth: '900px', margin: '0 auto', mb: 4 }}>
            <Box sx={{ mb: 2 }}>
              <ButtonUploadFiles onTextExtracted={handleFileUpload} />
            </Box>
            
            <InputTextArea 
              value={inputText} 
              onChange={(e) => {
                setInputText(e.target.value);
                setIsAnalyzed(false);
              }}
              placeholder="Введите или вставьте текст для анализа..."
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
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
                Анализировать
              </Button>
            </Box>
            
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
          </Box>

          {isAnalyzed && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: '900px', mx: 'auto', mb: 3 }}>
                <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Результат
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    backgroundColor: 'transparent',
                    textTransform: 'none',
                    borderRadius: '20px',
                    padding: '4px 16px',
                    fontSize: '0.85rem',
                    '&:hover': {
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    }
                  }}
                >
                  Скачать
                </Button>
              </Box>
              
              {/* Статистика текста - первая */}
              <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 5 }}>
                <TextStatisticsComponent text={inputText} />
              </Box>
              
              {/* Облако слов и анализ частей речи - горизонтально */}
              <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto', mb: 5 }}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      borderRadius: '16px', 
                      border: '1px solid var(--card-border)',
                      height: '100%',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)', fontWeight: 500 }}>
                      Облако слов
                    </Typography>
                    <WordCloudComponent text={inputText} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      borderRadius: '16px', 
                      border: '1px solid var(--card-border)',
                      height: '100%',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, color: 'var(--text-primary)', fontWeight: 500 }}>
                      Части речи
                    </Typography>
                    <POSAnalysisComponent text={inputText} />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          <Box sx={{ mt: isAnalyzed ? 2 : 0, textAlign: 'left', maxWidth: '900px', mx: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'var(--text-primary)', fontWeight: 600, textAlign: 'left' }}>
              О сервисе
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: 1.9, mb: 3, textAlign: 'left', fontWeight: 400 }}>
              Сервис анализа текстов помогает визуализировать ключевые слова, получить анализ частей речи и понять структуру текста, рассчитав статистические показатели.
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Облако слов</strong><br></br>
              Показывает наиболее часто встречающиеся слова в тексте. Чем больше и центральнее слово, тем чаще оно используется. Это помогает быстро определить основные темы и ключевые понятия.
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Анализ частей речи</strong><br></br>
              Показывает распределение существительных, глаголов, прилагательных и других частей речи в тексте. Это помогает оценить стиль текста: научные тексты содержат больше существительных, художественные — больше прилагательных и глаголов.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Статистика текста</strong><br></br>
              Статистика текста считает количество слов, символов с пробелами и без, предложений и абзацев. Также показывает число уникальных слов и процент лексического разнообразия. Рассчитывает среднюю длину слова и предложения, время чтения. Определяет уровень сложности текста по длине слов и предложений и индекс удобочитаемости Флеша. Выделяет топ-5 самых частых значимых слов.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Лексическое разнообразие</strong><br></br>
              Это отношение уникальных слов к общему количеству слов, выраженное в процентах. Если показатель выше 50 процентов, текст считается лексически богатым, если ниже 30 процентов — бедным, с частыми повторами. В норме хороший текст имеет показатель около 40-50 процентов.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Время чтения</strong><br></br>
              Приблизительное время, которое потребуется, чтобы прочитать текст. Рассчитывается исходя из средней скорости чтения 200 слов в минуту. Например, текст из 600 слов будет читаться около 3 минут.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Уровень сложности</strong><br></br>
              Интегральная оценка текста, основанная на средней длине слова и средней длине предложения. Если оба показателя низкие, текст считается легким. Если оба показателя высокие — сложным. Промежуточные значения дают средний уровень сложности.
            </Typography>

            <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.85, mb: 2, textAlign: 'left' }}>
              <strong style={{ fontWeight: 600 }}>Индекс удобочитаемости Флеша</strong><br></br>
              Это числовая шкала от 0 до 100, которая показывает, насколько легко читать текст. Чем выше значение, тем проще текст. Значения от 90 до 100 соответствуют очень легкому тексту, который понимают дети младших классов. Значения от 60 до 70 — это нормальный, понятный текст для широкой аудитории. Значения от 30 до 50 — сложные тексты, требующие концентрации, такие как научные статьи. Значения ниже 30 — очень сложные, профессиональные или технические тексты.
            </Typography>
          </Box>
        </Container>
      </Box>
      <FooterNew />
    </>
  );
};

export default AnalysisPage;