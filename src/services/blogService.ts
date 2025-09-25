import { BlogPost, BlogCategory, BlogFilters } from '../types/blog';

// Mock data for development
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "React 19 새로운 기능들",
    excerpt: "React 19에서 추가된 새로운 기능들과 개선사항들을 살펴보고, 실제 프로젝트에 어떻게 적용할 수 있는지 알아봅니다.",
    content: "React 19의 상세한 내용...",
    category: "기술",
    date: "2024-01-15",
    readTime: "5분",
    author: "H",
    tags: ["React", "JavaScript", "Frontend"],
    featured: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    slug: "react-19-new-features"
  },
  {
    id: 2,
    title: "개발자의 일상",
    excerpt: "개발자의 하루 일과와 개발 과정에서 겪는 다양한 경험들을 공유합니다. 코딩부터 디버깅까지의 여정을 담았습니다.",
    content: "개발자 일상의 상세한 내용...",
    category: "일상",
    date: "2024-01-12",
    readTime: "3분",
    author: "H",
    tags: ["일상", "개발팁", "생산성"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    slug: "developer-daily-life"
  },
  {
    id: 3,
    title: "맛있는 음식 추천",
    excerpt: "개발하면서 먹기 좋은 음식들과 간단한 요리법을 소개합니다. 건강한 식습관으로 더 나은 개발을 해보세요.",
    content: "음식 추천의 상세한 내용...",
    category: "음식",
    date: "2024-01-10",
    readTime: "4분",
    author: "H",
    tags: ["음식", "요리", "건강"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
    slug: "delicious-food-recommendations"
  },
  {
    id: 4,
    title: "TypeScript 고급 패턴",
    excerpt: "TypeScript의 고급 기능들을 활용한 실용적인 패턴들을 소개합니다. 제네릭, 유틸리티 타입, 조건부 타입 등을 다룹니다.",
    content: "TypeScript 고급 패턴의 상세한 내용...",
    category: "기술",
    date: "2024-01-08",
    readTime: "7분",
    author: "H",
    tags: ["TypeScript", "JavaScript", "타입"],
    featured: true,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    slug: "typescript-advanced-patterns"
  },
  {
    id: 5,
    title: "여행 후기 - 일본",
    excerpt: "일본 여행에서 경험한 개발자 관점의 흥미로운 것들을 공유합니다. 기술 문화와 현지 개발자들과의 만남 이야기입니다.",
    content: "일본 여행 후기의 상세한 내용...",
    category: "여행",
    date: "2024-01-05",
    readTime: "6분",
    author: "H",
    tags: ["여행", "일본", "문화"],
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    slug: "japan-travel-review"
  },
  {
    id: 6,
    title: "독서 후기 - 클린 코드",
    excerpt: "로버트 C. 마틴의 '클린 코드'를 읽고 느낀 점과 실제 적용 사례를 공유합니다.",
    content: "클린 코드 독서 후기의 상세한 내용...",
    category: "독서",
    date: "2024-01-03",
    readTime: "4분",
    author: "H",
    tags: ["독서", "클린코드", "개발"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    slug: "clean-code-book-review"
  },
  {
    id: 7,
    title: "Framer Motion 애니메이션 가이드",
    excerpt: "React에서 Framer Motion을 사용하여 부드러운 애니메이션을 만드는 방법을 단계별로 설명합니다.",
    content: "Framer Motion 가이드의 상세한 내용...",
    category: "기술",
    date: "2024-01-20",
    readTime: "8분",
    author: "H",
    tags: ["React", "Framer Motion", "애니메이션"],
    featured: true,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
    slug: "framer-motion-animation-guide"
  },
  {
    id: 8,
    title: "GitHub Pages 배포하기",
    excerpt: "React 앱을 GitHub Pages에 무료로 배포하는 방법과 자동화 설정을 알아봅니다.",
    content: "GitHub Pages 배포 가이드의 상세한 내용...",
    category: "기술",
    date: "2024-01-18",
    readTime: "6분",
    author: "H",
    tags: ["GitHub", "배포", "React"],
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800",
    slug: "github-pages-deployment"
  }
];

class BlogService {
  private posts: BlogPost[] = mockBlogPosts;

  // Get all posts
  async getAllPosts(): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.posts];
  }


  // Get post by ID
  async getPostById(id: number): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.posts.find(post => post.id === id) || null;
  }

  // Get post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.posts.find(post => post.slug === slug) || null;
  }

  // Get filtered posts
  async getFilteredPosts(filters: BlogFilters): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...this.posts];

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
  }

  // Get categories
  async getCategories(): Promise<BlogCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categoryMap = new Map<string, number>();
    this.posts.forEach(post => {
      const count = categoryMap.get(post.category) || 0;
      categoryMap.set(post.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      count
    }));
  }

  // Get featured posts
  async getFeaturedPosts(): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.posts.filter(post => post.featured);
  }

  // Add new post (for future use)
  async addPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: Math.max(...this.posts.map(p => p.id)) + 1,
      slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-')
    };
    
    this.posts.unshift(newPost);
    return newPost;
  }

  // Update post (for future use)
  async updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return null;
    
    this.posts[index] = { ...this.posts[index], ...updates };
    return this.posts[index];
  }

  // Delete post (for future use)
  async deletePost(id: number): Promise<boolean> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    this.posts.splice(index, 1);
    return true;
  }
}

export const blogService = new BlogService();
