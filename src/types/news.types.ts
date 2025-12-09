/**
 * News Type Definitions
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDto {
  title: string;
  description: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {}

export type NewsCategory =
  | 'Technology'
  | 'Business'
  | 'Sports'
  | 'Entertainment'
  | 'Health'
  | 'Science'
  | 'Politics'
  | 'World';
