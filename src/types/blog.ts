export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  slug?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  count: number;
}

export interface BlogFilters {
  searchTerm: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
}

export interface BlogState {
  posts: BlogPost[];
  filteredPosts: BlogPost[];
  categories: BlogCategory[];
  filters: BlogFilters;
  pagination: BlogPagination;
  loading: boolean;
  error: string | null;
}
