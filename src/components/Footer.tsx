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
    window.open('https://www.youtube.com', '_blank');
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
              onClick={handleYouTubeClick}
              className="youtube-btn"
              aria-label="YouTube 채널 방문"
            >
              <svg viewBox="0 0 24 24" className="youtube-icon">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
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
