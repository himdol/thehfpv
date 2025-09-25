import { BlogPost, BlogCategory, BlogFilters } from '../types/blog';
import apiService from './api';

class BlogService {

  // Get all posts with pagination
  async getAllPosts(page: number = 1, limit: number = 10): Promise<{ posts: BlogPost[]; totalPages: number; hasMore: boolean }> {
    try {
      const response = await apiService.getBlogPosts(page, limit);
      return {
        posts: response.data,
        totalPages: response.pagination.totalPages,
        hasMore: page < response.pagination.totalPages
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
      return response.data.find(post => post.slug === slug) || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  // Get filtered posts
  async getFilteredPosts(filters: BlogFilters): Promise<BlogPost[]> {
    try {
      const response = await apiService.getBlogPosts(1, 100); // Get all posts for filtering
      let filtered = response.data;

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(post => post.category === filters.category);
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(post => 
          filters.tags!.some(tag => post.tags.includes(tag))
        );
      }

      // Featured filter
      if (filters.featured !== undefined) {
        filtered = filtered.filter(post => !!post.featured === filters.featured);
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering posts:', error);
      return [];
    }
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
      return response.data.filter(post => post.featured);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  // Update post like
  async updatePostLike(id: number, isLiked: boolean): Promise<{ likes: number; isLiked: boolean } | null> {
    try {
      const response = await apiService.updatePostLike(id, isLiked);
      return response.data;
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