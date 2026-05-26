using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Services
{
    public interface IPayPalOrderService
    {
        Task<string> CreateOrderAsync(decimal amount);
        Task<bool> CaptureOrderAsync(string orderId);
    }
}
