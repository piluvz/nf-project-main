import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../style/MainPage.css';
import { FaArrowDownLong } from "react-icons/fa6";

const MainPage = () => {
  const featuresRef = useRef(null);

  const handleScrollDown = () => {
    const offset = 15; 
    if (featuresRef.current) {
      const topPosition = featuresRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
          <h1>DiaCare.ai</h1>
        </div>
        <nav>
          <Link to="/login" className="nav-button login">Login</Link>
          <Link to="/register" className="nav-button register">Register</Link>
        </nav>
      </header>

      <main className="content">
        <div className="hero-section">
          <div className='section'>
            <div className="info-section">
              <h2>Your Partner in Diabetes Management</h2>
              <p style={{ fontFamily: 'Montserrat, sans-serif', marginBottom: '9px' }}>DiaCare — инновационное решение для людей с диабетом и тех, кто стремится предотвратить развитие этого заболевания. Мы предлагаем инструменты для мониторинга уровня глюкозы в крови, диагностики ретинопатии и подбора диеты.</p>
            </div>
            <div className="infographic">
              <img className='image_im' src="image.png" alt="" />
            </div>
          </div>
          <FaArrowDownLong className='arr_down' onClick={handleScrollDown} />
        </div>

        <div className="features-section" ref={featuresRef}>
          <h3>Our Key Features</h3>
          <div className="feature-cards">
            <div className="feature-card">
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', textAlign: 'center', marginBottom: '25px'}}>Диабетический сканер пищи</h4>
              <p className='para' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', textAlign: 'center', marginBottom: '20px'}}>Загрузите изображение блюда, и наш искусственный интеллект определит, подходит ли оно для диабетиков и в каком количестве его можно употреблять.</p>
              <Link to="/food-scanner" id='second' className="cta-button">Использовать</Link>
            </div>
            <div className="feature-card">
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', textAlign: 'center', marginBottom: '25px'}}>Расширение для Arbuz.kz</h4>
              <p className='para' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', textAlign: 'center', marginBottom: '20px'}}>Наше расширение для сервиса доставки продуктов Arbuz.kz помогает людям с диабетом сделать правильный выбор продуктов и рассчитать допустимые порции. Наведите на продукт, чтобы узнать, можно ли его употреблять и в каком количестве.</p>
              <Link to="/arbuz" id='first' className="cta-button">Перейти в Arbuz.kz</Link>
            </div>
            <div className="feature-card">
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', textAlign: 'center', marginBottom: '25px'}}>Диагностика ретинопатии</h4>
              <p  className='para' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', textAlign: 'center', marginBottom: '20px'}}>Используя снимки глазного дна, DiaCare может диагностировать диабетическую ретинопатию, что способствует раннему выявлению и лечению этого заболевания.</p>
              <Link to="/retinopathy-check" id='third' className="cta-button">Перейти</Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 DiaCare</p>
      </footer>
    </div>
  );
};

export default MainPage;
