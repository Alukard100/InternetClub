using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Transaction;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternetClub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> GetTransactions([FromQuery] TransactionFilter filter, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var paging = new PagingParameters
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            var transactions = await _service.GetAllTransactionsAsync(filter, paging);
            return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionRequest request)
        {
            if (request.Amount <= 0)
                return Ok(false);

            var success = await _service.CreateTransactionReceiptAsync(request);

            return Ok(success);
        }
    }
}
