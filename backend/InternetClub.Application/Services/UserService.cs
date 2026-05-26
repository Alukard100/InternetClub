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
        private readonly IJwtService _jwtService;
        public UserService(IUserRepository repo, IPasswordHasher hasher, IJwtService jwtService) 
        {
            _repo = repo;
            _hasher = hasher;
            _jwtService = jwtService;
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
                AvailableSeconds = u.AvailableSeconds,
                ExpiresAt = u.ExpiresAt
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
                AvailableSeconds = user.AvailableSeconds,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> StartTimerAsync(Guid userId)
        {
            var user = await _repo.GetUserByIdAsync(userId);

            if (user == null)
                return false;

            user.Activate();

            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> StopTimerAsync(Guid userId)
        {
            var user = await _repo.GetUserByIdAsync(userId);

            if (user == null)
                return false;
            
            user.Deactivate();

            await _repo.SaveChangesAsync();
            return true;

        }

        public async Task UserTransactionUpdateAsync(UserTransactionUpdateRequest request)
        {
            var user = await _repo.GetUserByIdAsync(request.UserId);

            int increase = (int)request.Amount * 600;

            decimal totalSpent = await _repo.CountTransactionAsync(user.Id);

            user.UpdateAmount(increase, totalSpent);

            await _repo.SaveChangesAsync();
        }

        public async Task<string> Login(LoginRequest request)
        {
            var user = await _repo.GetUserByUsernameAsync(request.Username);

            if (user == null || !_hasher.Verify(request.Password, user.PasswordHash))
                return null;

            var token = _jwtService.GenerateToken(user);

            return token;
        }

        public async Task<UserGetResponse> GetUserAsync(string username)
        {
            var user = await _repo.GetUserByUsernameAsync(username);

            if (user == null)
                return null;

            return new UserGetResponse
            {
                Id = user.Id,
                Username = user.Username,
                UserRole = user.Role,
                AvailableSeconds = user.AvailableSeconds,
                ExpiresAt = user.ExpiresAt,
                Status = user.Status,
                TotalMoneySpent = user.TotalMoneySpent
            };
        }
    }
}
