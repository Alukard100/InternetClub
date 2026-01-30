using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserResponse> RegisterAsync(CreateUserRequest request);
        Task<PagedResult<UserTableResponse>> ListUsersAsync(string? usernameFilter, PagingParameters paging);
    }
}
