using InternetClub.Application.DTOs.Article;
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
    }
}
