using InternetClub.Application.DTOs.Transaction;
using InternetClub.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace InternetClub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayPalController : ControllerBase
    {
        private readonly IPayPalOrderService _paymentService;
        private readonly ITransactionService _transactionService;

        public PayPalController(IPayPalOrderService paymentService, ITransactionService transaction)
        {
            _paymentService = paymentService;
            _transactionService = transaction;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder(CreatePaymentRequest request)
        {
            var orderId = await _paymentService.CreateOrderAsync(request.Amount);

            return Ok(new { orderId });
        }

        [HttpPost("capture")]
        public async Task<IActionResult> CaptureOrder(CapturePaymentRequest request)
        {
            var success = await _paymentService.CaptureOrderAsync(request.OrderId);

            if (!success)
                return BadRequest();

            await _transactionService.CreateTransactionReceiptAsync(
                new TransactionRequest
                {
                    UserId = request.UserId,
                    Amount = request.Amount,
                    Type = Domain.Enums.TransactionType.Online
                });

            return Ok();
        }
    }
}
