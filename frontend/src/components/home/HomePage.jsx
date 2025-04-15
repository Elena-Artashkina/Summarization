import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Главная страница</h1>
      <button 
        onClick={() => navigate('/summarize')}
        className="primary-button"
      >
        Перейти к суммаризации
      </button>
    </div>
  );
}

export default HomePage;