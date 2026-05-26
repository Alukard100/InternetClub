using InternetClub.Application.DTOs.Dashboard;
using InternetClub.Application.DTOs.Transaction;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUserRepository _userRepo;
        private readonly IArticleRepository _articleRepo;
        private readonly IDashboardRepository _dashboardRepo;
        private readonly ITransactionRepository _transactionRepo;
        public DashboardService(IUserRepository userRepo, IDashboardRepository dashboardRepo, IArticleRepository articleRepo, ITransactionRepository transactionRepo)
        {
            _userRepo = userRepo;
            _dashboardRepo = dashboardRepo;
            _articleRepo = articleRepo;
            _transactionRepo = transactionRepo;
        }

        public async Task<DashboardDto> GetDashboardAsync()
        {
            int userCount = await _userRepo.CountAsync(null);

            int articleCount = await _articleRepo.CountAsync(null, null, null);

            var temp = new TransactionFilter
            {
                EndDate = null,
                StartDate = null,
                Type = null,
                Username = null
            };

            int transactionCount = await _transactionRepo.CountAsync(temp);

            decimal monthlyEarnings = await _dashboardRepo.GetMonthlyEarningAsync();

            List<PaymentMethodStatDto> paymentStats = await _dashboardRepo.GetPaymentMethodCountAsync();

            List<WeeklyStatDto> weeklyStats = await _dashboardRepo.GetWeeklyStatsAsync();

            return new DashboardDto
            {
                UserCount = userCount,
                ArticleCount = articleCount,
                MonthlyEarnings = monthlyEarnings,
                TotalTransactions = transactionCount,
                PaymentStats = paymentStats,
                WeeklyStats = weeklyStats
            };

        }
    }
}
