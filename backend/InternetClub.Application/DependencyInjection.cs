using InternetClub.Application.Interfaces.Abstraction;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IArticleService, ArticleService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IPayPalOrderService, PayPalOrderService>();
            
            return services;
        }
    }
}
