// import '../../styles/SummarizationPage.css';
// import { useState } from 'react';
// import InputTextArea from './InputTextArea';
// import Header from './Header';
// import ButtonUploadFiles from './ButtonUploadFiles';
// import ButtonSummarize from './ButtonSummarize';
// import OutputTextArea from './OutputTextArea';
// import { Col, Row } from 'antd';
// import CssBaseline from '@mui/material/CssBaseline';
// import Container from '@mui/material/Container';
// import { getSummary } from '../../api/summarize'; // Импортируем функцию запроса
// import { useNavigate } from 'react-router-dom';

// function SummarizationPage() {
//   // Добавляем состояния
//   const [inputText, setInputText] = useState('');
//   const [summary, setSummary] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Хук для навигации

//   // Обработчик для текста из файла
//   const handleFileUpload = (fileContent) => {
//     setInputText(fileContent); // Устанавливаем содержимое файла в состояние
//   };

//   // Функция для обработки суммаризации
//   const handleSummarize = async () => {
//     if (!inputText.trim()) return;
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const result = await getSummary(inputText);
//       setSummary(result.summary);
//     } catch (err) {
//       console.error('Ошибка при запросе:', err);
//       setError('Произошла ошибка при генерации резюме');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <CssBaseline />
//       <Container maxWidth="xxl">
//         <div>
//           <Header />
//           <br />
//           <br />
//           <br />
//           <h1>Сгенерируй саммари по своему тексту</h1> 
//           <p>Вставь текст в форму ниже и получи краткое содержание</p>
//           {error && <div style={{ color: 'red' }}>{error}</div>}
//           <br />
//         </div>
//       </Container>

//       <Container maxWidth="lg">
//         <div>
//           <Row>
//             <Col span={12}>
//               <InputTextArea 
//                 value={inputText} 
//                 onChange={(e) => setInputText(e.target.value)} 
//               />
//               {/* <ButtonUploadFiles /> */}
//               <ButtonUploadFiles onTextExtracted={handleFileUpload} />
//               <ButtonSummarize 
//                 onClick={handleSummarize}
//                 disabled={!inputText.trim() || isLoading}
//               />
//             </Col>
//             <Col span={12}>
//               <OutputTextArea 
//                 summary={summary}
//                 loading={isLoading}
//               />
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </>
//   );
// }

// export default SummarizationPage;