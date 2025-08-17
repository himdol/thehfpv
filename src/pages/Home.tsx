import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 드론 위치 애니메이션 - banner-section 아래에서만 움직임
  const droneX = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    [0, 200, -150, 300, -200, 100]
  );
  const droneY = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    [1000, 100, 200, 150, 300, 200]
  );
  const droneRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const droneScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const droneOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // 스프링 효과 추가
  const springDroneX = useSpring(droneX, { stiffness: 80, damping: 25 });
  const springDroneY = useSpring(droneY, { stiffness: 80, damping: 25 });
  const springDroneScale = useSpring(droneScale, { stiffness: 100, damping: 30 });

  // 섹션별 애니메이션 variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div ref={containerRef} className={`home-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* 전체 페이지 드론 */}
      <motion.div 
        ref={droneRef}
        className="global-drone"
        style={{
          x: springDroneX,
          y: springDroneY,
          rotate: droneRotation,
          scale: springDroneScale,
          opacity: droneOpacity
        }}
      >
        <div className="drone-body">
          <div className="drone-propeller drone-propeller-1"></div>
          <div className="drone-propeller drone-propeller-2"></div>
          <div className="drone-propeller drone-propeller-3"></div>
          <div className="drone-propeller drone-propeller-4"></div>
          <div className="drone-camera"></div>
        </div>
      </motion.div>

      {/* 배너 섹션 */}
      <section className="banner-section">
        <div className="banner-background">
          <div className="banner-image"></div>
          <div className="banner-overlay"></div>
          <div className="banner-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
          <motion.div 
            className="banner-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >

            <h1 className="banner-title">
              Hello! 👋
              <br />
              <span className="highlight">Welcome</span> to H's Website
            </h1>
            <p className="banner-subtitle">
              <span className="highlight">#</span>DRONE <span className="highlight">#</span>FPV <span className="highlight">#</span>DIY 
            </p>
            <motion.div 
              className="banner-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="stat-item">
                <span className="stat-number">2025. 7. 7.</span>
                <span className="stat-label">START YOUTUBE</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2025. 8. 17.</span>
                <span className="stat-label">START WEBSITE</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">PENDING</span>
                <span className="stat-label">START DIY</span>
              </div>
            </motion.div>
            <motion.div 
              className="banner-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                YOTUBE
              </motion.button>
              <motion.button 
                className="btn-secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                BLOG
              </motion.button>
              <motion.button 
                className="btn-secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                SHOP
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="scroll-arrow">↓</div>
          <span>Scroll to see more</span>
        </motion.div>
      </section>



      {/* 소개 섹션 - 착륙 시나리오 */}
      <motion.section 
        className="section about-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-content">
          <motion.div 
            className="landing-pad"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="section-title">소개</h2>
            <p className="section-description">
              프론트엔드 개발자로서 React, TypeScript, 그리고 최신 웹 기술에 대한 
              경험과 지식을 공유하고 있습니다.
            </p>
            <motion.button 
              className="btn-landing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              착륙하기
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* 블로그 섹션 - 착륙 시나리오 */}
      <motion.section 
        className="section blog-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-content">
          <motion.div 
            className="landing-pad"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="section-title">블로그</h2>
            <p className="section-description">
              기술 이야기, 일상, 그리고 다양한 경험을 담은 글들을 만나보세요.
            </p>
            <motion.button 
              className="btn-landing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              착륙하기
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* 샵 섹션 - 착륙 시나리오 */}
      <motion.section 
        className="section shop-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-content">
          <motion.div 
            className="landing-pad"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="section-title">샵</h2>
            <p className="section-description">
              개발자를 위한 다양한 제품들을 만나보세요.
            </p>
            <motion.button 
              className="btn-landing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              착륙하기
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
