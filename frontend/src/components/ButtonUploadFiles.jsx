import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload({ onTextExtracted }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем расширение файла
    if (!file.name.endsWith('.txt')) {
      alert('Пожалуйста, загрузите файл с расширением .txt');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result;
      onTextExtracted(content);
      event.target.value = '';
    };
    
    reader.onerror = () => {
      console.error('Ошибка при чтении файла');
      alert('Ошибка при чтении файла');
      event.target.value = ''; // Сбрасываем и при ошибке
    };
    
    reader.readAsText(file);
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Загрузить .txt файл
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        accept=".txt"
      />
    </Button>
  );
}