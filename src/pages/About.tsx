import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useCounter } from '../hooks/useCounter';

const About: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [emailForm, setEmailForm] = useState({
    userEmail: '',
    subject: '',
    message: ''
  });

  // Counter animations
  const totalPostCount = useCounter({ end: 156, duration: 1500 });
  const todayVisitorCount = useCounter({ end: 2847, duration: 2500 });
  const totalVisitorCount = useCounter({ end: 15200, suffix: 'K', duration: 3000 });

  const skills = [
    { name: 'Filming', icon: '🎥' },
    { name: 'Editting', icon: '✂️' },
    { name: 'Piloting', icon: '🚁' },
    { name: 'Developing', icon: '💻' }
  ];

  const experiences = [
    {
      title: 'FPV Content Creator',
      company: 'Current Activity',
      period: '2025 - Present',
      description: 'FPV drone filming, video editing, content creation and online sales.',
      color: '#ef4444'
    },
    {
      title: 'Web Developer',
      company: 'Backend',
      period: '2020 - 2025',
      description: 'Developed a website based on Java',
      color: '#3b82f6'
    }
  ];

  const projects = [
    {
      title: 'Online FPV filming education',
      description: 'Comprehensive online courses teaching FPV drone filming techniques and piloting skills',
      tech: ['Video Production', 'Online Courses', 'FPV Techniques', 'Community'],
      image: '/images/education.svg'
    },
    {
      title: 'Operating FPV platform',
      description: 'Creating a dedicated platform for FPV enthusiasts to share and discover content',
      tech: ['Platform Development', 'User Community', 'Content Sharing', 'Social Features'],
      image: '/images/platform.svg'
    },
    {
      title: 'Sharing experience',
      description: 'Documenting and sharing personal FPV journey and experiences with the community',
      tech: ['Blog Writing', 'Video Content', 'Experience Sharing', 'Community Building'],
      image: '/images/sharing.svg'
    }
  ];

  // 로그인 상태 확인 및 이메일 자동 입력
  useEffect(() => {
    // 실제로는 localStorage나 쿠키에서 로그인 정보를 확인
    const savedEmail = localStorage.getItem('userEmail');
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (loginStatus === 'true' && savedEmail) {
      setIsLoggedIn(true);
      setLoggedInEmail(savedEmail);
      setEmailForm(prev => ({ ...prev, userEmail: savedEmail }));
    }
  }, []);

  // 이메일 팝업이 열릴 때 로그인된 이메일 자동 입력
  useEffect(() => {
    if (showEmailPopup && isLoggedIn) {
      setEmailForm(prev => ({ ...prev, userEmail: loggedInEmail }));
    }
  }, [showEmailPopup, isLoggedIn, loggedInEmail]);

  const handleEmailSubmit = () => {
    // 이메일 인증 및 전송 로직
    if (!emailForm.userEmail || !emailForm.subject || !emailForm.message) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // 보안코드 전송 및 인증 팝업 표시
    sendVerificationCode(emailForm.userEmail);
    setShowEmailPopup(false);
    setShowVerificationPopup(true);
  };

  const sendVerificationCode = (email: string) => {
    // 실제로는 서버에 보안코드 전송 요청
    console.log(`${email}로 보안코드를 전송했습니다.`);
    // 임시로 6자리 랜덤 코드 생성 (실제로는 서버에서 생성)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('생성된 보안코드:', code);
    // 실제로는 서버에서 이메일로 전송
  };

  const handleVerificationSubmit = () => {
    if (!verificationCode) {
      alert('보안코드를 입력해주세요.');
      return;
    }
    
    // 실제로는 서버에서 보안코드 검증
    console.log('보안코드 검증:', verificationCode);
    
    // 검증 성공 시 이메일 전송
    console.log('이메일 전송:', emailForm);
    alert('이메일이 성공적으로 전송되었습니다!');
    
    // 팝업 닫기 및 폼 초기화
    setShowVerificationPopup(false);
    setEmailForm({ userEmail: '', subject: '', message: '' });
    setVerificationCode('');
  };

  return (
    <div className={`about-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-hero-content">
          <motion.div
            className="about-profile-image"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img 
              src="/profile.jpg" 
              alt="Profile" 
              className="about-profile-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
            <div className="about-profile-fallback">H</div>
          </motion.div>
          
          <motion.div
            className="about-hero-text"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="about-title">
              Hey there, I'm <span className="about-title-highlight">H</span>! 🚁
            </h1>
            <div className="about-subtitle">
              <motion.div
                className="about-subtitle-line about-subtitle-main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Wannabe FPV pilot here! 🚀
              </motion.div>
              <motion.div
                className="about-subtitle-line about-subtitle-question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Curious to know more? 🎮
              </motion.div>
              <motion.div
                className="about-subtitle-line about-subtitle-welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                You're in the right place!
              </motion.div>
              <motion.div
                className="about-subtitle-line about-subtitle-call"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                Let's learn and have fun together! 😎
              </motion.div>
            </div>
            
            <div className="about-hero-stats">
              <div className="about-stat">
                <span className="about-stat-number">{totalPostCount}</span>
                <span className="about-stat-label">TOTAL POST</span>
              </div>
              <div className="about-stat about-stat-visitor">
                <span className="about-stat-number">{todayVisitorCount}</span>
                <span className="about-stat-label">Today</span>
                <span className="about-stat-badge">🔥 HOT</span>
              </div>
              <div className="about-stat about-stat-visitor">
                <span className="about-stat-number">{totalVisitorCount}</span>
                <span className="about-stat-label">Total Visitors</span>
                <span className="about-stat-badge">⭐ POPULAR</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="about-section-header">
          <h2 className="about-section-title">What can I do?</h2>
          <p className="about-section-subtitle">These are the things I love to do with FPV drones.</p>
        </div>
        
        <div className="about-skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="about-skill-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="about-skill-icon">{skill.icon}</div>
              <h3 className="about-skill-name">{skill.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        className="about-section"
        ref={useRef(null)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-section-header">
          <h2 className="about-section-title">Experience</h2>
          <p className="about-section-subtitle">Tracing my path so far</p>
        </div>
        
        <div className="about-timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="about-timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="about-timeline-dot" style={{ backgroundColor: exp.color }} />
              <div className="about-timeline-content">
                <div className="about-timeline-period">{exp.period}</div>
                <h3 className="about-timeline-title">{exp.title}</h3>
                <p className="about-timeline-company">{exp.company}</p>
                <p className="about-timeline-description">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <div className="about-section-header">
          <h2 className="about-section-title">Future Plans</h2>
          <p className="about-section-subtitle">What I'm planning to do next</p>
        </div>
        
        <div className="about-projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="about-project-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="about-project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="about-project-placeholder">📱</div>
              </div>
              <div className="about-project-content">
                <h3 className="about-project-title">{project.title}</h3>
                <p className="about-project-description">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="about-contact"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <div className="about-contact-content">
          <h2 className="about-contact-title">Hit me up anytime</h2>
          <p className="about-contact-subtitle">
            Let's grow together!
          </p>
          
          <div className="about-contact-buttons">
            <motion.button
              onClick={() => setShowEmailPopup(true)}
              className="about-contact-btn about-contact-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send email
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Email Popup */}
      {showEmailPopup && (
        <motion.div
          className="email-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="email-popup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="email-popup-header">
              <h3>Send Email</h3>
              <button 
                className="email-popup-close"
                onClick={() => setShowEmailPopup(false)}
              >
                ×
              </button>
            </div>
            
            <div className="email-popup-content">
              <div className="email-form-group">
                <input
                  type="email"
                  value={emailForm.userEmail}
                  onChange={(e) => setEmailForm({...emailForm, userEmail: e.target.value})}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="email-form-group">
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                  placeholder="Email subject"
                  required
                />
              </div>
              
              <div className="email-form-group">
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                />
              </div>
              
              <div className="email-popup-buttons">
                <button 
                  className="email-btn email-btn-cancel"
                  onClick={() => setShowEmailPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className="email-btn email-btn-send"
                  onClick={handleEmailSubmit}
                >
                  Send Email
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Verification Code Popup */}
      {showVerificationPopup && (
        <motion.div
          className="email-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="email-popup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="email-popup-header">
              <h3>Email Verification</h3>
              <button 
                className="email-popup-close"
                onClick={() => setShowVerificationPopup(false)}
              >
                ×
              </button>
            </div>
            
            <div className="email-popup-content">
              <div className="verification-info">
                <p>We've sent a verification code to:</p>
                <p className="verification-email">{emailForm.userEmail}</p>
                <p className="verification-instruction">Please enter the 6-digit code below:</p>
              </div>
              
              <div className="email-form-group">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  maxLength={6}
                  className="verification-input"
                />
              </div>
              
              <div className="email-popup-buttons">
                <button 
                  className="email-btn email-btn-cancel"
                  onClick={() => setShowVerificationPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className="email-btn email-btn-send"
                  onClick={handleVerificationSubmit}
                >
                  Verify & Send
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default About;