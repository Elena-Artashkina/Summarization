import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function BasicButtons({ onClick, disabled }) {
  return (
    <Stack spacing={2} direction="row">
      <Button 
      variant="contained"      
      onClick={onClick}
      // disabled={disabled}
      >
        Суммаризовать
      </Button>
    </Stack>
  );
}

export default BasicButtons;