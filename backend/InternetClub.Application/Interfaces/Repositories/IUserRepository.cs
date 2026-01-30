using InternetClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task AddAsync(User user);
        Task<bool> ExistsByUsernameAsync(string username);
        Task<int> CountAsync(string? usernameFilter);
        Task<List<User>> GetUsersAsync(string? usernameFilter, int skip, int take);
    }
}
