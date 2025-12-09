/**
 * News Service
 *
 * Handles all news-related API calls.
 * Automatically switches between mock API and real API based on API_CONFIG.MOCK_API
 */

import { api } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import { API_CONFIG } from '@/utils/constants';
import type {
  NewsArticle,
  CreateNewsDto,
  UpdateNewsDto,
  NewsCategory,
} from '@/types/news.types';

class NewsService {
  /**
   * Get all news articles
   */
  async getNews(): Promise<NewsArticle[]> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<NewsArticle[]>('/news');
    }
    return await api.get<NewsArticle[]>('/news');
  }

  /**
   * Get single news article by ID
   */
  async getNewsById(id: string): Promise<NewsArticle> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.get<NewsArticle>(`/news/${id}`);
    }
    return await api.get<NewsArticle>(`/news/${id}`);
  }

  /**
   * Get news by category
   */
  async getNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
    if (API_CONFIG.MOCK_API) {
      const allNews = await mockApi.get<NewsArticle[]>('/news');
      return allNews.filter((article) => article.category === category);
    }
    return await api.get<NewsArticle[]>('/news', {
      params: { category },
    });
  }

  /**
   * Search news articles
   */
  async searchNews(query: string): Promise<NewsArticle[]> {
    if (API_CONFIG.MOCK_API) {
      const allNews = await mockApi.get<NewsArticle[]>('/news');
      return allNews.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    return await api.get<NewsArticle[]>('/news/search', {
      params: { q: query },
    });
  }

  /**
   * Create new news article (admin only)
   */
  async createNews(data: CreateNewsDto): Promise<NewsArticle> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.post<NewsArticle>('/news', data);
    }
    return await api.post<NewsArticle>('/news', data);
  }

  /**
   * Update news article (admin only)
   */
  async updateNews(id: string, data: UpdateNewsDto): Promise<NewsArticle> {
    if (API_CONFIG.MOCK_API) {
      return await mockApi.put<NewsArticle>(`/news/${id}`, data);
    }
    return await api.put<NewsArticle>(`/news/${id}`, data);
  }

  /**
   * Delete news article (admin only)
   */
  async deleteNews(id: string): Promise<void> {
    if (API_CONFIG.MOCK_API) {
      await mockApi.delete(`/news/${id}`);
    } else {
      await api.delete(`/news/${id}`);
    }
  }
}

export const newsService = new NewsService();
