// src/api/summarize.js
// export const getSummary = async (text) => {
//     const response = await fetch('http://127.0.0.1:8000/api/v1/summarize', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ text: text })
//     });
    
//     if (!response.ok) {
//       throw new Error('Ошибка при запросе');
//     }
    
//     return await response.json();
// };

// НОВАЯ ФУНКЦИЯ: Запуск суммаризации (асинхронная)
export const startSummarize = async (text) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    });
    
    if (!response.ok) {
        throw new Error('Ошибка при запуске суммаризации');
    }
    
    return await response.json();
};

// НОВАЯ ФУНКЦИЯ: Проверка статуса задачи суммаризации
export const checkSummarizeStatus = async (taskId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/summarize/status/${taskId}`);
    
    if (!response.ok) {
        throw new Error('Ошибка при проверке статуса');
    }
    
    return await response.json();
};

// НОВАЯ ФУНКЦИЯ: Получение результата суммаризации (опционально)
export const getSummarizeResult = async (taskId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/summarize/result/${taskId}`);
    
    if (!response.ok) {
        throw new Error('Ошибка при получении результата суммаризации');
    }
    
    return await response.json();
};

// Функция для получения облака слов
export const getWordCloud = async (text) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/wordcloud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при получении облака слов');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Ошибка при запросе к бэкенду:', error);
        return { words: [] };
    }
};

export const getPOSAnalysis = async (text) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/partofspeechanalysis', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    });
    
    if (!response.ok) {
        throw new Error('Ошибка при анализе частей речи');
    }
    
    return await response.json();
};

// Функция для получения статистики
export const getTextStats = async (text) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/text-stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    });
    
    if (!response.ok) {
        throw new Error('Ошибка при получении статистики');
    }
    
    return await response.json();
};

export const getSMMLegalCheck = async (text) => {
    const response = await fetch('http://127.0.0.1:8000/api/v1/smm/legal-check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
    });
    
    if (!response.ok) {
        throw new Error('Ошибка при юридической проверке');
    }
    
    return await response.json();
};