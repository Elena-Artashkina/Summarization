import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import SummarizationPage from './pages/SummarizationPage';
import SMMPage from './pages/SMMPage';

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/summarization" element={<SummarizationPage />} />
        <Route path="/smm" element={<SMMPage />} />
      </Routes>
    </>
  );
}

export default App;

