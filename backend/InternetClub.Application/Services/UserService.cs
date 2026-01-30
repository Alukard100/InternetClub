using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.User;
using InternetClub.Application.Interfaces.Abstraction;
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
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly IPasswordHasher _hasher;
        public UserService(IUserRepository repo, IPasswordHasher hasher) 
        {
            _repo = repo;
            _hasher = hasher;
        }

        public async Task<PagedResult<UserTableResponse>> ListUsersAsync(string? usernameFilter, PagingParameters paging)
        {
            var skip = (paging.PageNumber - 1) * paging.PageSize;

            var totalCount = await _repo.CountAsync(usernameFilter);

            var users = await _repo.GetUsersAsync(usernameFilter, skip, paging.PageSize);

            var result = users.Select(u => new UserTableResponse
            {
                Id = u.Id,
                Username = u.Username,
                TotalMoneySpent = u.TotalMoneySpent,
                Status = u.Status,
                AvailableMinutes = u.AvailableMinutes
            }).ToList();

            return new PagedResult<UserTableResponse>
            {
                TotalCount = totalCount,
                Items = result
            };
        }

        public async Task<UserResponse> RegisterAsync(CreateUserRequest request)
        {
            if (await _repo.ExistsByUsernameAsync(request.Username))
            {
                return null;
            }
            
            var hash = _hasher.Hash(request.Password);

            var user = new User(request.Username, hash);

            await _repo.AddAsync(user);

            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                UserRole = user.Role,
                AvailableMinutes = user.AvailableMinutes,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
