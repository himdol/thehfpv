import React, { useState, useEffect } from 'react';
import visitorService, { VisitorStats } from '../services/visitorService';

interface VisitorStatsProps {
  className?: string;
}

const VisitorStatsComponent: React.FC<VisitorStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<VisitorStats>({
    todayVisitors: 0,
    totalVisitors: 0,
    lastUpdated: new Date().toISOString(),
    status: 'loading'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 통계 데이터 로드
  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await visitorService.getVisitorStats();
      setStats(data);
      
      if (data.status === 'error') {
        setError(data.message || '통계 조회에 실패했습니다.');
      }
    } catch (err) {
      console.error('통계 로드 실패:', err);
      setError('통계를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 통계 로드
  useEffect(() => {
    loadStats();
  }, []);

  // 주기적으로 통계 업데이트 (5분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`visitor-stats ${className}`}>
        <div className="visitor-stats-loading">
          <div className="loading-spinner"></div>
          <span>통계 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`visitor-stats ${className}`}>
        <div className="visitor-stats-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadStats} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`visitor-stats ${className}`}>
      <div className="visitor-stats-container">
        <div className="visitor-stat-item">
          <div className="stat-label">Today</div>
          <div className="stat-value">
            {visitorService.formatNumber(stats.todayVisitors)}
          </div>
          <div className="stat-unit">visitors</div>
        </div>
        
        <div className="visitor-stat-divider"></div>
        
        <div className="visitor-stat-item">
          <div className="stat-label">Total</div>
          <div className="stat-value">
            {visitorService.formatNumber(stats.totalVisitors)}
          </div>
          <div className="stat-unit">visitors</div>
        </div>
      </div>
      
      <div className="visitor-stats-footer">
        <span className="last-updated">
          마지막 업데이트: {visitorService.formatLastUpdated(stats.lastUpdated)}
        </span>
      </div>
    </div>
  );
};

export default VisitorStatsComponent;
