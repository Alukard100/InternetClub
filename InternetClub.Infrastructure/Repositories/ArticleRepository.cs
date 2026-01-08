using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Domain.Entities;
using InternetClub.Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly InternetClubDbContext _db;

        public ArticleRepository(InternetClubDbContext context)
        {
            _db = context;
        }
        public async Task AddAsync(Article article)
        {
            _db.Articles.Add(article);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Article article)
        {
            _db.Articles.Remove(article);
            await _db.SaveChangesAsync();
        }

        public async Task<Article> GetByIdAsync(Guid id)
        {
            var article = _db.Articles.FirstOrDefault(a => a.Id == id);
            return article;
        }
    }
}
