using InternetClub.Domain.Entities;
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
    }
}
