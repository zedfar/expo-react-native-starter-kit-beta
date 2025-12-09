import { NewsArticle, CreateNewsDto, UpdateNewsDto } from '@/types/news.types';
import * as db from 'server/db.json';

let newsArticles: NewsArticle[] = [...db.news];

export async function get<T = any>(url: string, config?: any): Promise<T> {
  // Get all news
  if (url === '/news') {
    return newsArticles as unknown as T;
  }

  // Get news by ID
  const newsIdMatch = url.match(/^\/news\/(.+)$/);
  if (newsIdMatch) {
    const id = newsIdMatch[1];
    const article = newsArticles.find((n) => n.id === id);
    if (!article) throw new Error('News article not found');
    return article as unknown as T;
  }

  throw new Error(`Unknown GET /news endpoint: ${url}`);
}

export async function post<T = any>(url: string, body?: any): Promise<T> {
  // Create news
  if (url === '/news') {
    const data = body as CreateNewsDto;
    const newArticle: NewsArticle = {
      id: String(newsArticles.length + 1),
      ...data,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newsArticles.push(newArticle);
    return newArticle as unknown as T;
  }

  throw new Error(`Unknown POST /news endpoint: ${url}`);
}

export async function put<T = any>(url: string, body?: any): Promise<T> {
  // Update news
  const newsIdMatch = url.match(/^\/news\/(.+)$/);
  if (newsIdMatch) {
    const id = newsIdMatch[1];
    const index = newsArticles.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('News article not found');

    const data = body as UpdateNewsDto;
    newsArticles[index] = {
      ...newsArticles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return newsArticles[index] as unknown as T;
  }

  throw new Error(`Unknown PUT /news endpoint: ${url}`);
}

export async function del<T = any>(url: string): Promise<T> {
  // Delete news
  const newsIdMatch = url.match(/^\/news\/(.+)$/);
  if (newsIdMatch) {
    const id = newsIdMatch[1];
    const index = newsArticles.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('News article not found');

    newsArticles.splice(index, 1);
    return {} as T;
  }

  throw new Error(`Unknown DELETE /news endpoint: ${url}`);
}
