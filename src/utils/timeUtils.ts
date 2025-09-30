// 시간 유틸리티 함수들

/**
 * 주어진 날짜로부터 현재 시간까지의 상대 시간을 계산합니다.
 * @param dateString - 날짜 문자열 (ISO 형식 또는 기타 형식)
 * @returns 상대 시간 문자열 (예: "1 min ago", "2 hours ago", "3 days ago")
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  let postDate: Date;
  
  // ISO 형식인 경우 직접 파싱
  if (dateString.includes('T') && dateString.includes('Z')) {
    postDate = new Date(dateString);
  } else if (dateString.includes('T')) {
    // ISO 형식이지만 Z가 없는 경우
    postDate = new Date(dateString + 'Z');
  } else {
    // 다른 형식인 경우
    postDate = new Date(dateString);
  }
  
  // 날짜가 유효하지 않은 경우
  if (isNaN(postDate.getTime())) {
    console.warn('Invalid date string:', dateString);
    return 'Unknown time';
  }
  
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  // 1분 미만
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // 1분 이상 1시간 미만
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }
  
  // 1시간 이상 24시간 미만
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  // 1일 이상 30일 미만
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  // 1개월 이상 12개월 미만
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  // 1년 이상
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * 날짜 문자열을 다양한 형식으로 파싱할 수 있도록 도와주는 함수
 * @param dateString - 날짜 문자열
 * @returns Date 객체
 */
export function parseDate(dateString: string): Date {
  // ISO 형식인 경우
  if (dateString.includes('T') || dateString.includes('Z')) {
    return new Date(dateString);
  }
  
  // MM-DD-YYYY 형식인 경우
  if (dateString.includes('-') && dateString.split('-').length === 3) {
    const parts = dateString.split('-');
    if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      // MM-DD-YYYY 형식
      return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
    } else if (parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
      // YYYY-MM-DD 형식
      return new Date(dateString);
    }
  }
  
  // 기본 파싱 시도
  return new Date(dateString);
}

/**
 * 백엔드에서 받은 날짜를 프론트엔드 형식으로 변환
 * @param backendDate - 백엔드에서 받은 날짜 (publishedAt 또는 createdAt)
 * @returns 상대 시간 문자열
 */
export function getRelativeTimeFromBackend(backendDate: string): string {
  try {
    // 백엔드에서 받은 날짜를 파싱
    const date = parseDate(backendDate);
    return getRelativeTime(date.toISOString());
  } catch (error) {
    console.error('Error parsing date:', backendDate, error);
    return 'Unknown time';
  }
}
