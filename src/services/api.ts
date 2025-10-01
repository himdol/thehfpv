// API service for blog data
import { BlogPost } from '../types/blog';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8080';

// Mock API response interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  posts: T[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
  success: boolean;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get authentication headers with JWT token
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Simulate API delay
  private async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic GET request
  private async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.delay();
    
    // Mock successful response
    return {
      data: {} as T,
      message: 'Success',
      success: true
    };
  }

  // Generic GET request for paginated data
  private async getPaginated<T>(endpoint: string): Promise<PaginatedResponse<T>> {
    await this.delay();
    
    // Mock successful paginated response
    return {
      posts: [] as T[],
      currentPage: 1,
      totalElements: 0,
      totalPages: 0,
      success: true
    };
  }

  // Blog API endpoints
  async getBlogPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts?page=${page}&size=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to frontend format
        const transformedPosts: BlogPost[] = result.posts.map((post: any) => ({
          id: post.postId,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || '',
          content: post.content,
          category: post.category,
          date: post.createdAt,
          readTime: this.calculateReadTime(post.content),
          author: (post.author?.firstName || '') + (post.author?.lastName ? ' ' + post.author.lastName : '') || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.likeCount || 0,
          viewCount: post.viewCount || 0,
          isLiked: post.isLiked || false,  // 백엔드에서 받은 isLiked 사용
          status: post.status || 'PUBLISHED'  // 백엔드에서 받은 status 사용
        }));

        return {
          posts: transformedPosts,
          currentPage: result.currentPage || page,
          totalElements: result.totalElements || transformedPosts.length,
          totalPages: result.totalPages || 1,
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      
      // Return mock data when API fails
      const mockPosts: BlogPost[] = [
        {
          id: 1,
          title: "Welcome to THE H FPV Blog",
          excerpt: "This is a sample blog post to demonstrate the blog functionality.",
          content: "This is the full content of the welcome blog post...",
          category: "filming",
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-'),
          readTime: "2 min",
          author: "Admin",
          tags: ["welcome", "blog", "sample"],
          featured: true,
          image: this.generateDefaultImage("Welcome to THE H FPV Blog"),
          slug: "welcome-to-the-h-fpv-blog",
          likes: 0,
          isLiked: false
        }
      ];
      
      return {
        posts: mockPosts,
        currentPage: 1,
        totalElements: mockPosts.length,
        totalPages: 1,
        success: true
      };
    }
  }

  // Calculate read time based on content length
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  // Generate default image with THE H FPV text
  private generateDefaultImage(title: string): string {
    // Create a data URL for a simple image with text
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 400);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);
      
      // Add THE H FPV text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('THE H FPV', 400, 200);
      
      // Add title below
      ctx.font = '24px Arial';
      ctx.fillText(title, 400, 250);
    }
    
    return canvas.toDataURL();
  }

  // Get blog post by ID
  async getBlogPostById(id: number): Promise<ApiResponse<BlogPost>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to frontend format
        const transformedPost: BlogPost = {
          id: result.postId,
          title: result.title,
          excerpt: result.excerpt || result.content?.substring(0, 150) + '...' || '',
          content: result.content,
          category: result.category,
          date: result.createdAt,
          readTime: this.calculateReadTime(result.content),
          author: (result.author?.firstName || '') + (result.author?.lastName ? ' ' + result.author.lastName : '') || 'Unknown',
          tags: result.tags ? result.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: result.featured || false,
          image: result.featuredImageUrl || this.generateDefaultImage(result.title),
          slug: result.slug,
          likes: result.likeCount || 0,
          isLiked: false,
          viewCount: result.viewCount || 0,
          status: result.status || 'PUBLISHED'
        };

        return {
          data: transformedPost,
          message: 'Post retrieved successfully',
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to fetch post');
      }
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      
      // Return error response
      return {
        data: {} as BlogPost,
        message: 'Failed to fetch post',
        success: false
      };
    }
  }

  async getBlogCategories(): Promise<ApiResponse<string[]>> {
    await this.delay();
    
    const categories = ["Tech", "Life", "Travel", "Food", "Book"];
    
    return {
      data: categories,
      message: 'Categories retrieved successfully',
      success: true
    };
  }

  async updatePostLike(id: number, isLiked: boolean): Promise<ApiResponse<{ likes: number; isLiked: boolean }>> {
    await this.delay();
    
    // Mock like update
    const newLikes = isLiked ? 25 : 23;
    
    return {
      data: { likes: newLikes, isLiked },
      message: 'Like updated successfully',
      success: true
    };
  }

  // Get posts by category with pagination
  async getBlogPostsByCategory(category: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts/category/${category}?page=${page}&size=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to frontend format
        const transformedPosts: BlogPost[] = result.posts.map((post: any) => ({
          id: post.postId,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || '',
          content: post.content,
          category: post.category,
          date: post.createdAt,
          readTime: this.calculateReadTime(post.content),
          author: (post.author?.firstName || '') + (post.author?.lastName ? ' ' + post.author.lastName : '') || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.likeCount || 0,
          viewCount: post.viewCount || 0,
          isLiked: false,
          status: post.status || 'PUBLISHED'
        }));

        return {
          posts: transformedPosts,
          currentPage: result.currentPage || page,
          totalElements: result.totalElements || transformedPosts.length,
          totalPages: result.totalPages || 1,
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to fetch category posts');
      }
    } catch (error) {
      console.error('Error fetching category posts:', error);
      
      // Return empty data when API fails
      return {
        posts: [],
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        success: false
      };
    }
  }

  // Search posts with pagination
  async searchBlogPosts(keyword: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to frontend format
        const transformedPosts: BlogPost[] = result.posts.map((post: any) => ({
          id: post.postId,
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...' || '',
          content: post.content,
          category: post.category,
          date: post.createdAt,
          readTime: this.calculateReadTime(post.content),
          author: (post.author?.firstName || '') + (post.author?.lastName ? ' ' + post.author.lastName : '') || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.likeCount || 0,
          viewCount: post.viewCount || 0,
          isLiked: false,
          status: post.status || 'PUBLISHED'
        }));

        return {
          posts: transformedPosts,
          currentPage: result.currentPage || page,
          totalElements: result.totalElements || transformedPosts.length,
          totalPages: result.totalPages || 1,
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to search posts');
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      
      // Return empty data when API fails
      return {
        posts: [],
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        success: false
      };
    }
  }

  // Toggle like for a blog post
  async toggleLike(postId: number): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts/${postId}/like`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          data: {
            isLiked: result.isLiked,
            likeCount: result.likeCount
          },
          message: 'Like toggled successfully',
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        data: { isLiked: false, likeCount: 0 },
        message: 'Failed to toggle like',
        success: false
      };
    }
  }

  // Get like status for a blog post
  async getLikeStatus(postId: number): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> {
    try {
      const response = await fetch(`${this.baseURL}/blog/posts/${postId}/like-status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          data: {
            isLiked: result.isLiked,
            likeCount: result.likeCount
          },
          message: 'Like status retrieved successfully',
          success: true
        };
      } else {
        throw new Error(result.message || 'Failed to get like status');
      }
    } catch (error) {
      console.error('Error getting like status:', error);
      return {
        data: { isLiked: false, likeCount: 0 },
        message: 'Failed to get like status',
        success: false
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
