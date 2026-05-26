using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Domain.Entities;
using InternetClub.Domain.Enums;
using InternetClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
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

        public async Task<int> CountAsync(string? titleFilter, bool? publishedFilter, ArticleType? typeFilter)
        {
            var query = _db.Articles.AsQueryable();

            if (!string.IsNullOrEmpty(titleFilter))
                query = query.Where(u => u.Title.Contains(titleFilter));

            if(publishedFilter.HasValue)
                query = query.Where(a => a.Published ==  publishedFilter);

            if (typeFilter.HasValue)
                query = query.Where(a => a.Type.Equals(typeFilter));

            return await query.CountAsync();
        }

        public async Task DeleteAsync(Article article)
        {
            _db.Articles.Remove(article);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsBySlugAsync(string slug)
            => await _db.Articles.AnyAsync(x => x.Slug == slug);

        public async Task<List<Article>> GetArticleAsync(string? titleFilter, bool? publishedFilter, ArticleType? typeFilter, int skip, int take)
        {
            var query = _db.Articles.AsQueryable();

            if (!string.IsNullOrEmpty (titleFilter))
                query = query.Where(t => t.Title.Contains(titleFilter));

            if (publishedFilter.HasValue)
                query = query.Where(a => a.Published == publishedFilter);

            if (typeFilter.HasValue)
                query = query.Where(a => a.Type.Equals(typeFilter));

            query = query.OrderByDescending(t => t.CreatedAt)
                        .Skip(skip)
                        .Take(take);

            return await query.ToListAsync();
        }

        public async Task<Article> GetByIdAsync(Guid id)
        {
            var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == id);
            return article;
        }

        public async Task<Article> GetBySlugAsync(string slug)
        {
            var article = await _db.Articles.FirstOrDefaultAsync(a => a.Slug == slug);
            return article;
        }

        public async Task SaveChangesAsync()
            => await _db.SaveChangesAsync();
        
    }
}
