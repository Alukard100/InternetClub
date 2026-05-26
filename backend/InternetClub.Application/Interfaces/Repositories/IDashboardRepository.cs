using InternetClub.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Repositories
{
    public interface IDashboardRepository
    {
        Task<decimal> GetMonthlyEarningAsync();
        Task<List<PaymentMethodStatDto>> GetPaymentMethodCountAsync();
        Task<List<WeeklyStatDto>> GetWeeklyStatsAsync();
    }
}
