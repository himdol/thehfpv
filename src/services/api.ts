// API service for blog data
import { BlogPost } from '../types/blog';

// Mock API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock API response interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
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
      data: [] as T[],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      },
      message: 'Success',
      success: true
    };
  }

  // Blog API endpoints
  async getBlogPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<BlogPost>> {
    await this.delay();
    
    // Mock blog posts data
    const mockBlogPosts: BlogPost[] = [
      {
        id: 1,
        title: "React 19 New Features",
        excerpt: "Explore the new features and improvements in React 19, and learn how to apply them in your projects.",
        content: "Detailed content about React 19...",
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
      },
      {
        id: 2,
        title: "Developer's Daily Life",
        excerpt: "Sharing various experiences from a developer's daily routine. From coding to debugging, here's the journey.",
        content: "Detailed content about developer's daily life...",
        category: "Life",
        date: "01-12-2024",
        readTime: "3 min",
        author: "H",
        tags: ["Daily", "Tips", "Productivity"],
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        slug: "developer-daily-life",
        likes: 18,
        isLiked: false
      },
      {
        id: 3,
        title: "Delicious Food Recommendations",
        excerpt: "Introducing tasty foods and simple recipes perfect for developers. Improve your coding with healthy eating habits.",
        content: "Detailed content about food recommendations...",
        category: "Food",
        date: "01-10-2024",
        readTime: "4 min",
        author: "H",
        tags: ["Food", "Cooking", "Health"],
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
        slug: "delicious-food-recommendations",
        likes: 31,
        isLiked: true
      },
      {
        id: 4,
        title: "TypeScript Advanced Patterns",
        excerpt: "Introducing practical patterns using TypeScript's advanced features. Covers generics, utility types, and conditional types.",
        content: "Detailed content about TypeScript advanced patterns...",
        category: "Tech",
        date: "01-08-2024",
        readTime: "7 min",
        author: "H",
        tags: ["TypeScript", "JavaScript", "Types"],
        featured: true,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        slug: "typescript-advanced-patterns",
        likes: 42,
        isLiked: false
      },
      {
        id: 5,
        title: "Travel Review - Japan",
        excerpt: "Sharing interesting experiences from a developer's perspective during Japan trip. Stories about tech culture and meeting local developers.",
        content: "Detailed content about Japan travel review...",
        category: "Travel",
        date: "01-05-2024",
        readTime: "6 min",
        author: "H",
        tags: ["Travel", "Japan", "Culture"],
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        slug: "japan-travel-review",
        likes: 29,
        isLiked: true
      },
      {
        id: 6,
        title: "Book Review - Clean Code",
        excerpt: "Sharing insights and real-world applications after reading Robert C. Martin's 'Clean Code'.",
        content: "Detailed content about Clean Code book review...",
        category: "Book",
        date: "01-03-2024",
        readTime: "4 min",
        author: "H",
        tags: ["Reading", "Clean Code", "Development"],
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        slug: "clean-code-book-review",
        likes: 15,
        isLiked: false
      },
      {
        id: 7,
        title: "Framer Motion Animation Guide",
        excerpt: "Step-by-step guide on creating smooth animations using Framer Motion in React applications.",
        content: "Detailed content about Framer Motion guide...",
        category: "Tech",
        date: "01-20-2024",
        readTime: "8 min",
        author: "H",
        tags: ["React", "Framer Motion", "Animation"],
        featured: true,
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
        slug: "framer-motion-animation-guide",
        likes: 37,
        isLiked: false
      },
      {
        id: 8,
        title: "Deploying to GitHub Pages",
        excerpt: "Learn how to deploy React apps to GitHub Pages for free and set up automation.",
        content: "Detailed content about GitHub Pages deployment guide...",
        category: "Tech",
        date: "01-18-2024",
        readTime: "6 min",
        author: "H",
        tags: ["GitHub", "Deployment", "React"],
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
        slug: "github-pages-deployment",
        likes: 52,
        isLiked: true
      }
    ];

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = mockBlogPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total: mockBlogPosts.length,
        totalPages: Math.ceil(mockBlogPosts.length / limit)
      },
      message: 'Posts retrieved successfully',
      success: true
    };
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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
