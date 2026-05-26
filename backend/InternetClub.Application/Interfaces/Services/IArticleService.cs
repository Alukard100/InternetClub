using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Article;
using InternetClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Services
{
    public interface IArticleService
    {
        Task<ArticleResponse> CreateAsync(CreateArticleRequest request);
        Task<bool> DeleteArticleAsync(Guid id);
        Task<bool> SoftDeleteArticleAsync(Guid id);
        Task<ArticleResponse> UpdateAsync(EditArticleRequest request);
        Task<PagedResult<ArticleTableResponse>> ListArticlesAsync(ListArticlesRequest filters, PagingParameters paging);
        Task<ArticleResponse> GetArticleAsync(Guid id);
        Task<ArticleResponse> GetArticleBySlugAsync(string slug);
    }
}
