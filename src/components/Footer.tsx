import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      // 실제 구독 로직은 여기에 추가
      console.log('구독 이메일:', email);
    }
  };

  const handleYouTubeClick = () => {
    window.open('https://www.youtube.com/@thehfpv', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/thehfpv/', '_blank');
  };

  return (
    <footer className={`footer ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Never miss</h3>
          <p>Get the latest updates</p>
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
              <button type="submit" className="subscribe-btn">
                SUBSCRIBE
              </button>
            </form>
          ) : (
            <div className="subscribed-message">
              <p>Thank you for subscribing! 🎉</p>
            </div>
          )}
        </div>
        
        <div className="footer-section">
          <div className="social-links">
            <button 
              onClick={handleInstagramClick}
              className="social-icon-btn"
              aria-label="Instagram 방문"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="social-icon instagram-icon" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
            <button 
              onClick={handleYouTubeClick}
              className="social-icon-btn"
              aria-label="YouTube 채널 방문"
              title="YouTube"
            >
              <svg viewBox="0 0 24 24" className="social-icon youtube-icon" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="made-by">Copyright © 2025 H</p>
      </div>
    </footer>
  );
};

export default Footer;
