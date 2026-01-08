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
                request.Type
            );

            await _repo.AddAsync( article );

            return new ArticleResponse
            {
                Id = article.Id,
                Title = article.Title,
                ThumbnailPath = article.ThumbnailPath,
                Content = article.Content,
                Type = article.Type,
                CreatedAt = article.CreatedAt
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

        public Task<bool> SoftDeleteArticleAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<ArticleResponse> UpdateAsync(EditArticleRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
