// frontend/src/components/SMM/SMMLegalCheck.jsx
import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Chip, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getSMMLegalCheck } from '../api/summarize';

const SMMLegalCheck = ({ text, onCheck, loading, result }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Проверка текста...</Typography>
      </Box>
    );
  }

  if (!result) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'danger': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#4caf50';
    }
  };

  return (
    <Box>
      <Alert 
        severity={result.status === 'danger' ? 'error' : result.status === 'warning' ? 'warning' : 'success'}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        <Typography variant="h6">{result.status_text}</Typography>
      </Alert>

      {result.violations?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#f44336' }}>
            <GavelIcon /> Нарушения
          </Typography>
          {result.violations.map((v, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{v.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{v.message}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {v.penalty && <Chip label={`Штраф: ${v.penalty}`} size="small" color="error" variant="outlined" />}
                {v.law && <Chip label={v.law} size="small" variant="outlined" />}
              </Box>
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: '#f44336' }}>
                Действие: {v.action}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      {result.warnings?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#ff9800' }}>
            <WarningIcon /> Предупреждения
          </Typography>
          {result.warnings.map((w, idx) => (
            <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{w.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{w.message}</Typography>
              {w.requirement && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold', color: '#ff9800' }}>
                  Требование: {w.requirement}
                </Typography>
              )}
              {w.penalty && <Chip label={`Штраф: ${w.penalty}`} size="small" color="warning" variant="outlined" sx={{ mt: 1 }} />}
            </Paper>
          ))}
        </Box>
      )}

      {result.blogger_note && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            📌 Для блогеров: {result.blogger_note.required}
            <br />Штраф: {result.blogger_note.penalty}
          </Typography>
        </Alert>
      )}

      {result.violations?.length === 0 && result.warnings?.length === 0 && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body1">
            ✅ Пост не содержит юридических нарушений. Можно публиковать!
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default SMMLegalCheck;