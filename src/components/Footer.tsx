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
              <img 
                src="/images/IG_logo.png" 
                alt="Instagram" 
                className="social-icon instagram-icon"
              />
            </button>
            <button 
              onClick={handleYouTubeClick}
              className="social-icon-btn"
              aria-label="YouTube 채널 방문"
              title="YouTube"
            >
              <img 
                src="/images/YT_logo.png" 
                alt="YouTube" 
                className="social-icon youtube-icon"
              />
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
