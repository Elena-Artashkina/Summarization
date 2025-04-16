import React, { useState } from 'react'; 
import { Input } from 'antd'; 

const { TextArea } = Input;

function InputTextArea({ value, onChange }) {  // Принимаем value и onChange из props

  // Локальное состояние для предпросмотра (оставляем как было)
  const [previewValue, setPreviewValue] = useState('');

  // Обработчик изменений
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);  // Пробрасываем изменение в родительский компонент
    }
    setPreviewValue(newValue);  // Обновляем локальное состояние для предпросмотра
  };

  return (
    <div style={{ margin: '24px' }}>
      {/* Заголовок (оставлен пустым, можно добавить текст при необходимости) */}
      <h3></h3>
      
      {/* Компонент TextArea с настройками: */}
      <TextArea
        rows={10} 
        placeholder="Введите текст..." 
        value={value}  // Используем value из props
        
        onChange={handleChange}  // Используем наш обработчик
        showCount 
        maxLength={10000} 
        minLength={200} 
        style={{ width: '90%' }} 
      />
      
      {/* Блок предпросмотра введённого текста (оставляем как было)
      <div style={{ marginTop: '20px' }}>
        Заголовок блока предпросмотра
        <strong>Введённый текст:</strong>
        Отображаем текущее значение текстового поля
        <p>{previewValue}</p>
      </div> */}
    </div>
  );
}

export default InputTextArea;