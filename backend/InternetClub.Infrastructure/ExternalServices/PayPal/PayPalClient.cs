using InternetClub.Application.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.ExternalServices.PayPal
{
    public class PayPalClient : IPayPalClientRepository
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public PayPalClient(HttpClient http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        public async Task<string> GetAccessTokenAsync()
        {
            var byteArray = Encoding.ASCII.GetBytes(
                $"{_config["PayPal:ClientId"]}:{_config["PayPal:Secret"]}");

            _http.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            var response = await _http.PostAsync(
                $"{_config["PayPal:BaseUrl"]}/v1/oauth2/token",
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "client_credentials")
                }));

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(json)
                .RootElement.GetProperty("access_token").GetString()!;
        }
    }
}
