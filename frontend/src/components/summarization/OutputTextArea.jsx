import React, { useState, useEffect } from 'react';
import { Input, Spin } from 'antd';

const { TextArea } = Input;

function OutputTextArea({ summary, loading, onSummaryChange }) {  // Добавили callback для изменений
  const [previewValue, setPreviewValue] = useState('');

  useEffect(() => {
    setPreviewValue(summary || '');
  }, [summary]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setPreviewValue(newValue);
    if (onSummaryChange) {
      onSummaryChange(newValue);  // Пробрасываем изменения наружу
    }
  };

  return (
    <div style={{ margin: '24px' }}>
      {/* <h3>Редактор резюме</h3> */}
      
      {loading ? (
        <Spin size="large" />
      ) : (
        <TextArea
          rows={10}
          placeholder="Здесь появится саммари"
          value={previewValue}
          onChange={handleChange}  // Используем наш обработчик
          showCount
          maxLength={10000}
          style={{ width: '90%' }}
          readOnly={false}  // Явно разрешаем редактирование
        />
      )}
      
      {/* <div style={{ marginTop: '20px' }}>
        <strong>Текущее резюме:</strong>
        <p>{previewValue}</p>
      </div> */}
    </div>
  );
}

export default OutputTextArea;