using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Article;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request)
        {
            var article = await _service.CreateAsync(request);
            
            return CreatedAtAction(nameof(GetArticle), new { id = article.Id}, article);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> DeleteArticle(Guid id)
        {
            bool result = await _service.DeleteArticleAsync(id);

            return Ok(result);
        }

        [HttpGet("Unique/{id}")]
        public async Task<IActionResult> GetArticle(Guid id)
        {
            var result = await _service.GetArticleAsync(id);
            if (result == null) { return NotFound(); }

            return Ok(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetArticleBySlug(string slug)
        {
            var result = await _service.GetArticleBySlugAsync(slug);
            if (result == null) { return NotFound(); };

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetArticles([FromQuery] string? titleFilter, [FromQuery] bool? publishedFilter, [FromQuery] ArticleType? typeFilter, int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var paging = new PagingParameters
            {
                PageSize = pageSize,
                PageNumber = pageNumber
            };

            var filter = new ListArticlesRequest
            {
                TitleFilter = titleFilter,
                PublishedFilter = publishedFilter,
                TypeFilter = typeFilter
            };

            var articles = await _service.ListArticlesAsync(filter, paging);
            return Ok(articles);
        }

        [HttpPatch]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> UpdateArticle([FromBody] EditArticleRequest request)
        {
            var response = await _service.UpdateAsync(request);
            if (response == null) { return BadRequest(); }
            return Ok(response);
        }
    }
}
