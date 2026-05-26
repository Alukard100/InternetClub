using InternetClub.Application.Common.Pagination;
using InternetClub.Domain.Entities;
using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Repositories
{
    public interface IArticleRepository
    {
        Task AddAsync(Article article);
        Task DeleteAsync(Article article);
        Task<Article> GetByIdAsync(Guid id);
        Task<Article> GetBySlugAsync(string slug);
        Task<int> CountAsync(string? titleFilter, bool? publishedFilter, ArticleType? typeFilter);
        Task<List<Article>> GetArticleAsync(string? titleFilter, bool? publishedFilter, ArticleType? typeFilter, int skip, int take);
        Task<bool> ExistsBySlugAsync(string slug);
        Task SaveChangesAsync();
    }
}
