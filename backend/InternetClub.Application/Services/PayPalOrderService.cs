using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class PayPalOrderService : IPayPalOrderService
    {
        private readonly IPayPalClientRepository _payPalClient;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        public PayPalOrderService(IPayPalClientRepository payPalClient, IConfiguration configuration, HttpClient httpClient)
        {
            _payPalClient = payPalClient;
            _config = configuration;
            _httpClient = httpClient;
        }

        public async Task<bool> CaptureOrderAsync(string orderId)
        {
            var token = await _payPalClient.GetAccessTokenAsync();

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PostAsJsonAsync(
                $"{_config["PayPal:BaseUrl"]}/v2/checkout/orders/{orderId}/capture",
                new { });

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);

            return response.IsSuccessStatusCode;
        }

        public async Task<string> CreateOrderAsync(decimal amount)
        {
            var token = await _payPalClient.GetAccessTokenAsync();

            var request = new
            {
                intent = "CAPTURE",
                purchase_units = new[]
                {
                    new
                    {
                        amount = new
                        {
                            currency_code = "USD",
                            value = amount.ToString("F2", CultureInfo.InvariantCulture)
                        }
                    }
                }
            };

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.PostAsJsonAsync(
                $"{_config["PayPal:BaseUrl"]}/v2/checkout/orders", 
                request);

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(json)
                .RootElement.GetProperty("id").GetString()!;

        }

        
    }
}
