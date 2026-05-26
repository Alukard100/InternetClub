using InternetClub.Application.Interfaces.Abstraction;
using InternetClub.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternetClub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalImageStorageController : ControllerBase
    {
        private readonly IImageStorageService _service;

        public LocalImageStorageController(IImageStorageService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (!file.ContentType.StartsWith("image/"))
                return BadRequest("Invalid file type.");

            using (var stream = file.OpenReadStream())
            {
                var url = await _service.UploadAsync(stream, file.FileName, file.ContentType);
                return Ok(new { url });
            }
        }
    }
}
