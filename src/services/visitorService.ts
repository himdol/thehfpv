// 방문자 통계 관련 타입 정의
export interface VisitorStats {
  todayVisitors: number;
  totalVisitors: number;
  lastUpdated: string;
  status: string;
  message?: string;
}

export interface TrackVisitorResponse {
  status: string;
  message: string;
}

// 방문자 통계 서비스
class VisitorService {
  private baseUrl = 'http://localhost:8080/api';

  /**
   * 방문자 통계 조회
   */
  async getVisitorStats(): Promise<VisitorStats> {
    try {
      console.log('=== 방문자 통계 조회 시작 ===');
      
      const response = await fetch(`${this.baseUrl}/visitor/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VisitorStats = await response.json();
      console.log('방문자 통계 조회 성공:', data);
      
      return data;
    } catch (error) {
      console.error('방문자 통계 조회 실패:', error);
      
      // 에러 시 기본값 반환
      return {
        todayVisitors: 0,
        totalVisitors: 0,
        lastUpdated: new Date().toISOString(),
        status: 'error',
        message: '방문자 통계 조회에 실패했습니다.'
      };
    }
  }

  /**
   * 방문자 추적
   */
  async trackVisitor(): Promise<TrackVisitorResponse> {
    try {
      console.log('=== 방문자 추적 시작 ===');
      
      const response = await fetch(`${this.baseUrl}/visitor/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TrackVisitorResponse = await response.json();
      console.log('방문자 추적 성공:', data);
      
      return data;
    } catch (error) {
      console.error('방문자 추적 실패:', error);
      
      return {
        status: 'error',
        message: '방문자 추적에 실패했습니다.'
      };
    }
  }

  /**
   * 통계 초기화 (개발/테스트용)
   */
  async resetStats(): Promise<TrackVisitorResponse> {
    try {
      console.log('=== 통계 초기화 시작 ===');
      
      const response = await fetch(`${this.baseUrl}/visitor/reset`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TrackVisitorResponse = await response.json();
      console.log('통계 초기화 성공:', data);
      
      return data;
    } catch (error) {
      console.error('통계 초기화 실패:', error);
      
      return {
        status: 'error',
        message: '통계 초기화에 실패했습니다.'
      };
    }
  }

  /**
   * 숫자를 천 단위로 포맷팅
   */
  formatNumber(num: number): string {
    return num.toLocaleString('ko-KR');
  }

  /**
   * 마지막 업데이트 시간을 상대적 시간으로 포맷팅
   */
  formatLastUpdated(lastUpdated: string): string {
    try {
      const date = new Date(lastUpdated);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 1) {
        return '방금 전';
      } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffMinutes < 1440) { // 24시간
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours}시간 전`;
      } else {
        return date.toLocaleDateString('ko-KR');
      }
    } catch (error) {
      console.error('시간 포맷팅 오류:', error);
      return '알 수 없음';
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const visitorService = new VisitorService();
export default visitorService;
