import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 무한 스크롤을 위한 상태
  const [scrollPosition1, setScrollPosition1] = useState(0);
  const [scrollPosition2, setScrollPosition2] = useState(0);
  const [scrollPosition3, setScrollPosition3] = useState(0);

  // 각 행의 아이템들 정의 (이미지와 텍스트를 모두 지원)
  const row1Items = [
    { text: '갤러리 사이트', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' }
  ];
  const row2Items = [
    { text: '도서 판매', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '브랜딩', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '포트폴리오', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '인테리어', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '원격 일자리', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' }
  ];
  const row3Items = [
    { text: '아트 갤러리', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '전시회', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '게임', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '영화 정보', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' },
    { text: '커밍순', image: 'https://velog.velcdn.com/images/sdb016/post/34bdac57-2d63-43ce-a14c-8054e9e036de/test.png' }
  ];

  // 진짜 무한루프를 위한 아이템 생성 함수 (이미지와 텍스트 지원)
  const createInfiniteItems = <T,>(items: T[]) => {
    if (items.length === 0) return [];
    
    // 무한루프를 위해 최소 2개 이상의 아이템이 필요
    // 1개 아이템일 때는 2개로 복사, 여러 개일 때는 1번 더 복사
    const repeatCount = items.length === 1 ? 2 : 2;
    return Array(repeatCount).fill(items).flat();
  };

  const infiniteRow1Items = createInfiniteItems(row1Items);
  const infiniteRow2Items = createInfiniteItems(row2Items);
  const infiniteRow3Items = createInfiniteItems(row3Items);

  // 무한 스크롤 애니메이션
  useEffect(() => {
    const animate = () => {
      // 각 행의 리셋 포인트 계산 (원본 아이템 세트가 완전히 지나간 후)
      const resetPoint1 = -100; // 첫 번째 세트가 완전히 지나간 후
      const resetPoint2 = -100;
      const resetPoint3 = -100;

      setScrollPosition1(prev => {
        const newPos = prev - 0.08;
        // 마지막 아이템이 끝나면 즉시 첫 번째 아이템으로 리셋
        return newPos <= resetPoint1 ? 0 : newPos;
      });
      
      setScrollPosition2(prev => {
        const newPos = prev - 0.055;
        return newPos <= resetPoint2 ? 0 : newPos;
      });
      
      setScrollPosition3(prev => {
        const newPos = prev - 0.035;
        return newPos <= resetPoint3 ? 0 : newPos;
      });
    };

    const interval = setInterval(animate, 30); // 30ms마다 업데이트 (더 부드럽게)
    return () => clearInterval(interval);
  }, []);

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
                 <div className="section-layout section-layout-left-image">
                   <div className="section-image">
                     {/* 이미지 공간 */}
                   </div>
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
               </div>
             </motion.section>


             {/* 스크린 슬라이드 섹션 */}
             <section className="screen-slide-scroll-section">
               <h2 className="screen-slide-title">PENDING</h2>
               <p className="screen-slide-subtitle"></p>
               
               <div className="screen-slide-container">
                 {/* 1행 - 빠른 속도 */}
                 <div 
                   className="screen-slide-row screen-slide-row-1"
                   style={{ transform: `translateX(${scrollPosition1}%)` }}
                 >
                   {infiniteRow1Items.map((item, index) => (
                     <div key={`row1-${index}`} className="screen-slide-item">
                       <img src={item.image} alt={item.text} />
                       <div className="item-content">
                         <span>{item.text}</span>
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* 2행 - 중간 속도 */}
                 <div 
                   className="screen-slide-row screen-slide-row-2"
                   style={{ transform: `translateX(${scrollPosition2}%)` }}
                 >
                   {infiniteRow2Items.map((item, index) => (
                     <div key={`row2-${index}`} className="screen-slide-item">
                       <img src={item.image} alt={item.text} />
                       <div className="item-content">
                         <span>{item.text}</span>
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* 3행 - 느린 속도 */}
                 <div 
                   className="screen-slide-row screen-slide-row-3"
                   style={{ transform: `translateX(${scrollPosition3}%)` }}
                 >
                   {infiniteRow3Items.map((item, index) => (
                     <div key={`row3-${index}`} className="screen-slide-item">
                       <img src={item.image} alt={item.text} />
                       <div className="item-content">
                         <span>{item.text}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </section>
    </div>
  );
};

export default Home;
