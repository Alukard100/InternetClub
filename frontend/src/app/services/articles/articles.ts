import { Injectable } from '@angular/core';
import { PagedResult } from '../../interfaces/paged-result';
import { HttpClient } from '@angular/common/http';
import { Article, ArticleCreateRequest, ArticleType } from '../../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private http: HttpClient) {}

  getArticles(titleFilter: string = '', publishedFilter: boolean | null = null, typeFilter: ArticleType | null = null, pageNumber: number = 1, pageSize: number = 10) {
    const params: any = {
      titleFilter,
      pageNumber,
      pageSize
    };
    if (publishedFilter !== null) {
      params.publishedFilter = publishedFilter;
    }
    if (typeFilter !== null) {
      params.typeFilter = typeFilter;
    }
    return this.http.get<PagedResult<Article>>('/api/Articles', {
      params
    });
  }

  getArticleById(id: string) {
    return this.http.get<Article>(`/api/Articles/Unique/${id}`);
  }

  getArticlesBySlug(slug: string) {
    return this.http.get<Article>(`/api/Articles/${slug}`);
  }

  createArticle(article: ArticleCreateRequest) {
    return this.http.post<Article>('/api/Articles', article);    
  }

  updateArticle(article: { id: string, title: string, content: string, type: ArticleType, thumbnailPath: string, published: boolean }) {
    return this.http.patch<Article>(`/api/Articles`, article);
  }

  deleteArticle(id: string) {
    return this.http.delete(`/api/Articles/${id}`);
  }

}
