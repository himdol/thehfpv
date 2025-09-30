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
        headers: {
          'Content-Type': 'application/json',
        }
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
          date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-'),
          readTime: this.calculateReadTime(post.content),
          author: post.author?.firstName + ' ' + post.author?.lastName || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.viewCount || 0,
          isLiked: false
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

  async getBlogPostById(id: number): Promise<ApiResponse<BlogPost>> {
    await this.delay();
    
    // Mock single post data
    const mockPost: BlogPost = {
      id,
      title: "React 19 New Features",
      excerpt: "Explore the new features and improvements in React 19, and learn how to apply them in your projects.",
      content: "This is the full content of the blog post...",
      category: "Tech",
      date: "01-15-2024",
      readTime: "5 min",
      author: "H",
      tags: ["React", "JavaScript", "Frontend"],
      featured: true,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      slug: "react-19-new-features",
      likes: 24,
      isLiked: false
    };

    return {
      data: mockPost,
      message: 'Post retrieved successfully',
      success: true
    };
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
        headers: {
          'Content-Type': 'application/json',
        }
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
          date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-'),
          readTime: this.calculateReadTime(post.content),
          author: post.author?.firstName + ' ' + post.author?.lastName || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.viewCount || 0,
          isLiked: false
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
        headers: {
          'Content-Type': 'application/json',
        }
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
          date: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-'),
          readTime: this.calculateReadTime(post.content),
          author: post.author?.firstName + ' ' + post.author?.lastName || 'Unknown',
          tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: post.featured || false,
          image: post.featuredImageUrl || this.generateDefaultImage(post.title),
          slug: post.slug,
          likes: post.viewCount || 0,
          isLiked: false
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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
