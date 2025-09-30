import { BlogPost, BlogCategory, BlogFilters } from '../types/blog';
import apiService from './api';

class BlogService {

  // Get all posts with pagination (legacy method)
  async getAllPostsWithPagination(page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[]; totalPages: number; hasMore: boolean }> {
    try {
      const response = await apiService.getBlogPosts(page, limit);
      return {
        posts: response.posts,
        totalPages: response.totalPages,
        hasMore: page < response.totalPages
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], totalPages: 0, hasMore: false };
    }
  }

  // Get post by ID
  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      const response = await apiService.getBlogPostById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  // Get post by slug (for future use)
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // For now, get all posts and find by slug
      const response = await apiService.getBlogPosts(1, 100);
      return response.posts.find(post => post.slug === slug) || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  // Get related posts (random 3 posts excluding current post)
  async getRelatedPosts(currentPostId: number, limit: number = 3): Promise<BlogPost[]> {
    try {
      const response = await apiService.getBlogPosts(1, 100);
      const allPosts = response.posts.filter(post => post.id !== currentPostId);
      
      // Shuffle array and take first 'limit' posts
      const shuffled = allPosts.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  // Get all posts (for client-side filtering)
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      // Try to fetch from API first
      const response = await apiService.getBlogPosts(1, 1000);
      return response.posts;
    } catch (error) {
      console.error('Error fetching posts from API, using mock data:', error);
      // Fallback to mock data
      return this.getMockPosts();
    }
  }

  // Get filtered posts with pagination (pure client-side filtering)
  async getFilteredPosts(filters: BlogFilters, page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[]; totalPages: number; hasMore: boolean }> {
    // Get all posts first
    const allPosts = await this.getAllPosts();
    let filtered = [...allPosts];

    // Apply all filters on the client side
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(post => post.category === filters.category);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(post => !!post.featured === filters.featured);
    }

    // Sort: featured posts first, then by date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Apply pagination
    const totalPages = Math.ceil(filtered.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filtered.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      totalPages: totalPages,
      hasMore: page < totalPages
    };
  }

  // Mock data for frontend-only operation
  private getMockPosts(): BlogPost[] {
    return [
      {
        id: 1,
        title: "React 19 새로운 기능들",
        excerpt: "React 19의 새로운 기능들을 살펴보고 실제 프로젝트에 적용하는 방법을 알아봅니다.",
        content: "<p>React 19의 새로운 기능들을 살펴보고 실제 프로젝트에 적용하는 방법을 알아봅니다.</p>",
        category: "production",
        date: "09-29-2024",
        readTime: "5 min",
        author: "이힘찬",
        tags: ["React", "JavaScript", "Frontend"],
        featured: true,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        slug: "react-19-new-features",
        likes: 24,
        isLiked: false
      },
      {
        id: 2,
        title: "Spring Boot 3.2 업데이트",
        excerpt: "Spring Boot 3.2의 주요 변경사항과 새로운 기능들을 정리했습니다.",
        content: "<p>Spring Boot 3.2의 주요 변경사항과 새로운 기능들을 정리했습니다.</p>",
        category: "production",
        date: "09-28-2024",
        readTime: "4 min",
        author: "이힘찬",
        tags: ["Spring", "Java", "Backend"],
        featured: false,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
        slug: "spring-boot-3-2-update",
        likes: 18,
        isLiked: false
      },
      {
        id: 3,
        title: "FPV 드론 촬영 기초",
        excerpt: "FPV 드론 촬영을 시작하는 분들을 위한 기본 가이드입니다.",
        content: "<p>FPV 드론 촬영을 시작하는 분들을 위한 기본 가이드입니다.</p>",
        category: "filming",
        date: "09-27-2024",
        readTime: "6 min",
        author: "이힘찬",
        tags: ["FPV", "드론", "촬영"],
        featured: true,
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
        slug: "fpv-drone-filming-basics",
        likes: 32,
        isLiked: false
      },
      {
        id: 4,
        title: "런닝 앱 개발기",
        excerpt: "개인 런닝 앱을 개발하면서 겪은 경험과 배운 점들을 공유합니다.",
        content: "<p>개인 런닝 앱을 개발하면서 겪은 경험과 배운 점들을 공유합니다.</p>",
        category: "running",
        date: "09-26-2024",
        readTime: "7 min",
        author: "이힘찬",
        tags: ["앱개발", "런닝", "모바일"],
        featured: false,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        slug: "running-app-development",
        likes: 15,
        isLiked: false
      },
      {
        id: 5,
        title: "일본 여행 후기",
        excerpt: "도쿄와 오사카를 다녀온 여행 후기와 추천 장소들을 소개합니다.",
        content: "<p>도쿄와 오사카를 다녀온 여행 후기와 추천 장소들을 소개합니다.</p>",
        category: "travel",
        date: "09-25-2024",
        readTime: "8 min",
        author: "이힘찬",
        tags: ["일본", "여행", "도쿄", "오사카"],
        featured: true,
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        slug: "japan-travel-review",
        likes: 28,
        isLiked: false
      },
      {
        id: 6,
        title: "TypeScript 고급 패턴",
        excerpt: "TypeScript의 고급 패턴과 실무에서 유용한 기법들을 정리했습니다.",
        content: "<p>TypeScript의 고급 패턴과 실무에서 유용한 기법들을 정리했습니다.</p>",
        category: "production",
        date: "09-24-2024",
        readTime: "6 min",
        author: "이힘찬",
        tags: ["TypeScript", "JavaScript", "개발"],
        featured: false,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        slug: "typescript-advanced-patterns",
        likes: 22,
        isLiked: false
      },
      {
        id: 7,
        title: "드론 조립 가이드",
        excerpt: "처음 드론을 조립하는 분들을 위한 상세한 가이드입니다.",
        content: "<p>처음 드론을 조립하는 분들을 위한 상세한 가이드입니다.</p>",
        category: "filming",
        date: "09-23-2024",
        readTime: "10 min",
        author: "이힘찬",
        tags: ["드론", "조립", "가이드"],
        featured: false,
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
        slug: "drone-assembly-guide",
        likes: 19,
        isLiked: false
      },
      {
        id: 8,
        title: "마라톤 완주 후기",
        excerpt: "첫 마라톤 완주 경험과 준비 과정을 공유합니다.",
        content: "<p>첫 마라톤 완주 경험과 준비 과정을 공유합니다.</p>",
        category: "running",
        date: "09-22-2024",
        readTime: "5 min",
        author: "이힘찬",
        tags: ["마라톤", "러닝", "완주"],
        featured: true,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        slug: "marathon-completion-review",
        likes: 35,
        isLiked: false
      },
      {
        id: 9,
        title: "유럽 배낭여행",
        excerpt: "유럽 3개국을 배낭여행한 경험과 팁들을 정리했습니다.",
        content: "<p>유럽 3개국을 배낭여행한 경험과 팁들을 정리했습니다.</p>",
        category: "travel",
        date: "09-21-2024",
        readTime: "9 min",
        author: "이힘찬",
        tags: ["유럽", "배낭여행", "여행"],
        featured: false,
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        slug: "europe-backpacking",
        likes: 26,
        isLiked: false
      },
      {
        id: 10,
        title: "Next.js 14 새 기능",
        excerpt: "Next.js 14의 새로운 기능들과 성능 개선사항을 살펴봅니다.",
        content: "<p>Next.js 14의 새로운 기능들과 성능 개선사항을 살펴봅니다.</p>",
        category: "production",
        date: "09-20-2024",
        readTime: "6 min",
        author: "이힘찬",
        tags: ["Next.js", "React", "웹개발"],
        featured: true,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
        slug: "nextjs-14-new-features",
        likes: 31,
        isLiked: false
      }
    ];
  }

  // Get categories
  async getCategories(): Promise<BlogCategory[]> {
    try {
      const response = await apiService.getBlogCategories();
      return response.data.map(category => ({
        id: category.toLowerCase(),
        name: category,
        count: 0 // Will be calculated on frontend
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get featured posts
  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const response = await apiService.getBlogPosts(1, 100);
      return response.posts.filter((post: BlogPost) => post.featured);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  // Toggle like for a blog post
  async toggleLike(postId: number): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const response = await apiService.toggleLike(postId);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      return { isLiked: false, likeCount: 0 };
    }
  }

  // Get like status for a blog post
  async getLikeStatus(postId: number): Promise<{ isLiked: boolean; likeCount: number }> {
    try {
      const response = await apiService.getLikeStatus(postId);
      return response.data;
    } catch (error) {
      console.error('Error getting like status:', error);
      return { isLiked: false, likeCount: 0 };
    }
  }

  // Update post like (legacy method - now uses toggleLike)
  async updatePostLike(id: number, isLiked: boolean): Promise<{ likes: number; isLiked: boolean } | null> {
    try {
      const result = await this.toggleLike(id);
      return { likes: result.likeCount, isLiked: result.isLiked };
    } catch (error) {
      console.error('Error updating post like:', error);
      return null;
    }
  }

  // Add new post (for future use)
  async addPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    // This would be implemented with a real API endpoint
    throw new Error('Add post not implemented yet');
  }

  // Update post (for future use)
  async updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    // This would be implemented with a real API endpoint
    throw new Error('Update post not implemented yet');
  }

  // Delete post (for future use)
  async deletePost(id: number): Promise<boolean> {
    // This would be implemented with a real API endpoint
    throw new Error('Delete post not implemented yet');
  }
}

export const blogService = new BlogService();
export default blogService;