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

  // Load statistics data
  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await visitorService.getVisitorStats();
      setStats(data);
      
      if (data.status === 'error') {
        setError(data.message || 'Failed to load statistics.');
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Unable to load statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load statistics on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Update statistics periodically (every 5 minutes)
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
          <span>Loading statistics...</span>
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
            Retry
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
          Last updated: {visitorService.formatLastUpdated(stats.lastUpdated)}
        </span>
      </div>
    </div>
  );
};

export default VisitorStatsComponent;
