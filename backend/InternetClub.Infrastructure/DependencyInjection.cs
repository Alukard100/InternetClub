using InternetClub.Application.Interfaces.Abstraction;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Application.Services;
using InternetClub.Infrastructure.ExternalServices.PayPal;
using InternetClub.Infrastructure.Persistence;
using InternetClub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<InternetClubDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), b => b.MigrationsAssembly("InternetClub.Infrastructure")));

            services.AddScoped<IArticleRepository, ArticleRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddHttpClient<PayPalClient>();
            services.AddScoped<IImageStorageService, LocalImageStorageService>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();
            services.AddScoped<IPayPalClientRepository, PayPalClient>();

            return services;
        }
    }
}
