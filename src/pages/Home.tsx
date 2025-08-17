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

  // 드론 위치 애니메이션
  const droneX = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 300, -200, 100]);
  const droneY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, -100, 50, -150]);
  const droneRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // 스프링 효과 추가
  const springDroneX = useSpring(droneX, { stiffness: 100, damping: 30 });
  const springDroneY = useSpring(droneY, { stiffness: 100, damping: 30 });

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
      {/* 배너 섹션 */}
      <section className="banner-section">
        <div className="banner-background">
          <div className="banner-overlay"></div>
          <motion.div 
            className="banner-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="banner-title">
              안녕하세요! 👋
              <span className="highlight">Himdol</span>입니다
            </h1>
            <p className="banner-subtitle">
              개발자의 여정을 담은 블로그에 오신 것을 환영합니다
            </p>
            <motion.div 
              className="banner-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="btn-primary">블로그 보기</button>
              <button className="btn-secondary">샵 둘러보기</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 드론 애니메이션 섹션 */}
      <section className="drone-section">
        <motion.div 
          ref={droneRef}
          className="drone"
          style={{
            x: springDroneX,
            y: springDroneY,
            rotate: droneRotation
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
        <div className="drone-trail"></div>
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
