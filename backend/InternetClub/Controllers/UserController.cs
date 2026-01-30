using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.User;
using InternetClub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace InternetClub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Register(CreateUserRequest request)
        {
            var result = await _service.RegisterAsync(request);

            if (result == null)
                return Conflict("Username already exists");
            
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string? search,[FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var paging = new PagingParameters
            {
                PageSize = pageSize,
                PageNumber = pageNumber
            };

            var users = await _service.ListUsersAsync(search, paging);
            return Ok(users);
        }
    }
}
