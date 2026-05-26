using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.User;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

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

        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserRequest request)
        {
            var result = await _service.RegisterAsync(request);

            if (result == null)
                return Conflict("Username already exists");
            
            return Ok(result);
        }
        [HttpGet]
        [Authorize(Roles = nameof(UserRole.Admin))]
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

        [HttpPatch("start/{id:Guid}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> ActivateUser(Guid id)
        {
            var result = await _service.StartTimerAsync(id);
            if (result)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPatch("stop/{id:Guid}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> DeactivateUser(Guid id)
        {
            var result = await _service.StopTimerAsync(id);
            if (result)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _service.Login(request);
            if (result == null)
                return Unauthorized();

            return Ok(new { token = result });
        }

        [HttpGet("me")]
        [Authorize(Roles = nameof(UserRole.User))]
        public async Task<IActionResult> GetCurrentUser()
        {
            Console.WriteLine("Hello");
            Console.WriteLine(User.Identity?.IsAuthenticated);

            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }

            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Name);

            if (userIdClaim == null)
                return Unauthorized();

            var username = userIdClaim.Value.ToString();

            var user = await _service.GetUserAsync(username);

            return Ok(user);
        }
    }
}
