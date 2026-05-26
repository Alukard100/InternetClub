using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Article;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepository _repo;
        public ArticleService(IArticleRepository repo)
        {
            _repo = repo;
        }

        public async Task<ArticleResponse> CreateAsync(CreateArticleRequest request)
        {
            var article = new Article(
                request.Title,
                request.ThumbnailPath,
                request.Content,
                request.Type,
                request.Published
            );

            var baseSlug = article.Slug;
            var slug = baseSlug;
            var counter = 1;

            while (await _repo.ExistsBySlugAsync(slug)) 
            { 
                slug = $"{article.Slug}-{counter}";
                counter++;
            }

            article.SetSlug(slug);

            await _repo.AddAsync( article );

            return new ArticleResponse
            {
                Id = article.Id,
                Title = article.Title,
                Slug = article.Slug,
                ThumbnailPath = article.ThumbnailPath,
                Content = article.Content,
                Type = article.Type,
                CreatedAt = article.CreatedAt,
                Published = article.Published
            };
        }

        public async Task<bool> DeleteArticleAsync(Guid id)
        {

            var article = await _repo.GetByIdAsync( id );

            if (article == null)
               return false;
            
            await _repo.DeleteAsync( article );

            return true;
        }

        public async Task<ArticleResponse> GetArticleAsync(Guid id)
        {
            var art = await _repo.GetByIdAsync( id );

            if (art == null) return null;

            return new ArticleResponse
            {
                Id = art.Id,
                Title = art.Title,
                Slug = art.Slug,
                ThumbnailPath = art.ThumbnailPath,
                Content = art.Content,
                Type = art.Type,
                Published = art.Published,
                CreatedAt = art.CreatedAt
            };
        }

        public async Task<ArticleResponse> GetArticleBySlugAsync(string slug)
        {
            var art = await _repo.GetBySlugAsync( slug );

            if (art == null) return null;

            return new ArticleResponse
            {
                Id = art.Id,
                Title = art.Title,
                Slug = art.Slug,
                ThumbnailPath = art.ThumbnailPath,
                Content = art.Content,
                Type = art.Type,
                Published = art.Published,
                CreatedAt = art.CreatedAt
            };
        }

        public async Task<PagedResult<ArticleTableResponse>> ListArticlesAsync(ListArticlesRequest filters, PagingParameters paging)
        {
            var skip = (paging.PageNumber - 1) * paging.PageSize;

            var totalCount = await _repo.CountAsync(filters.TitleFilter, filters.PublishedFilter, filters.TypeFilter);

            var articles = await _repo.GetArticleAsync(filters.TitleFilter, filters.PublishedFilter, filters.TypeFilter, skip, paging.PageSize);

            var result = articles.Select(a => new ArticleTableResponse
            {
                Id = a.Id,
                Title = a.Title,
                ThumbnailPath = a.ThumbnailPath,
                CreatedAt = a.CreatedAt,
                Published = a.Published,
                Slug = a.Slug,
                Type = a.Type
            }).ToList();

            return new PagedResult<ArticleTableResponse>
            {
                TotalCount = totalCount,
                Items = result
            };

               
        }

        public Task<bool> SoftDeleteArticleAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<ArticleResponse> UpdateAsync(EditArticleRequest request)
        {
            var article = await _repo.GetByIdAsync(request.Id);

            if (article == null)
                return null;

            article.UpdateContent(request.Title, request.Content, request.Type, request.ThumbnailPath, request.Published);

            await _repo.SaveChangesAsync();

            var response = new ArticleResponse
            {
                Id = article.Id,
                Title = article.Title,
                CreatedAt = article.CreatedAt,
                Published = article.Published,
                Type = article.Type,
                Content = article.Content,
                ThumbnailPath = article.ThumbnailPath
                
            };

            return response;

        }
    }
}
