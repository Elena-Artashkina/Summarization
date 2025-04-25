import './App.css';
import { useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { TextField } from '@mui/material';
import InputTextArea from './components/summarization/InputTextArea';
import Header from './components/Header';
import ButtonUploadFiles from './components/summarization/ButtonUploadFiles';
import ButtonSummarize from './components/summarization/ButtonSummarize';
import OutputTextArea from './components/summarization/OutputTextArea';
import Grid from '@mui/material/Grid2';
import { Col, Row } from 'antd';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { getSummary } from './api/summarize'; // Импортируем функцию запроса

function App() {
  // Добавляем состояния
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Обработчик для текста из файла
  const handleFileUpload = (fileContent) => {
    setInputText(fileContent); // Устанавливаем содержимое файла в состояние
  };

  // Функция для обработки суммаризации
  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getSummary(inputText);
      setSummary(result.summary);
    } catch (err) {
      console.error('Ошибка при запросе:', err);
      setError('Произошла ошибка при генерации резюме');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <div>
          <br></br>
          <Header />
          
          <br />
          <br />
          <h1>Сгенерируй саммари по своему тексту</h1> 
          <p>Вставь текст в форму ниже и получи краткое содержание</p>
          {error && <div style={{ color: 'red' }}>{error}</div>}

        </div>
      </Container>

      <Container maxWidth="lg">
      <Row>
        <Col span={24} style={{ paddingLeft: '25px' }}>
          <ButtonUploadFiles 
          onTextExtracted={handleFileUpload}
          />
       </Col>
      </Row>
        <div>
          <Row>
            <Col span={12}>
            
              <InputTextArea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
              />
              {/* <ButtonUploadFiles /> */}
              
              {/* <ButtonSummarize 
                onClick={handleSummarize}
                disabled={!inputText.trim() || isLoading}
              /> */}
            </Col>
            <Col span={12}>
              <OutputTextArea 
                summary={summary}
                loading={isLoading}
                onSummaryChange={setSummary}
              />
            </Col>
          </Row>
        </div>
        <br></br>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <ButtonSummarize 
            onClick={handleSummarize}
            disabled={!inputText.trim() || isLoading}
          />
        </div>
        
      </Container>
    </>
  );
}

export default App;