import React, { useState, useEffect } from 'react'; // Добавили недостающие импорты
import { Input, Spin } from 'antd';

const { TextArea } = Input;

function OutputTextArea({ summary, loading }) {
  const [previewValue, setPreviewValue] = useState('');

  useEffect(() => {
    setPreviewValue(summary || '');
  }, [summary]);

  return (
    <div style={{ margin: '24px' }}>
      <h3></h3>
      
      {loading ? (
        <Spin size="large" />
      ) : (
        <TextArea
          rows={10}
          placeholder="Здесь появится резюме"
          value={summary || ''}
          onChange={(e) => setPreviewValue(e.target.value)}
          showCount
          maxLength={10000}
          minLength={200}
          style={{ width: '90%' }}

        />
      )}
      
      <div style={{ marginTop: '20px' }}>
        <strong>Текущее резюме:</strong>
        <p>{previewValue}</p>
      </div>
    </div>
  );
}

export default OutputTextArea;