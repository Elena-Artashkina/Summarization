export const getSummary = async (text) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text : text})
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при запросе');
    }
    
    return await response.json();
  }






// // frontend/src/api/summarize.js
// import apiClient from './client';

// export const summarizeText = (text) => {
//   return apiClient.post('/summarize', { text });
// };