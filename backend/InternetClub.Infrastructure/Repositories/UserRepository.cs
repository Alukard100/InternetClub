using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Domain.Entities;
using InternetClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly InternetClubDbContext _db;
        public UserRepository(InternetClubDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        public async Task<int> CountAsync(string? usernameFilter)
        {
            var query = _db.Users.AsQueryable();

            if (!string.IsNullOrEmpty(usernameFilter))
                query = query.Where(u => u.Username.Contains(usernameFilter));
            
            return await query.CountAsync();

        }

        public async Task<bool> ExistsByUsernameAsync(string username)
            =>   await _db.Users.AnyAsync(u => u.Username == username);

        public async Task<List<User>> GetUsersAsync(string? usernameFilter, int skip, int take)
        {
            var query = _db.Users.AsQueryable();

            if (!string.IsNullOrEmpty(usernameFilter))
                query = query.Where(u => u.Username.Contains(usernameFilter));

            return await query.OrderBy(u => u.Status)
                .ThenBy(u => u.Username)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }
}
