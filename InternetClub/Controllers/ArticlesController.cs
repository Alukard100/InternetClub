using InternetClub.Application.DTOs.Article;
using InternetClub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace InternetClub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _service;

        public ArticlesController(IArticleService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
        {
            var article = await _service.CreateAsync(request);
            
            return Ok(article);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            bool result = await _service.DeleteArticleAsync(id);

            return Ok(result);
        }
    }
}
