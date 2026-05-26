using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Dashboard
{
    public class DashboardDto
    {
        public int UserCount { get; set; }
        public int ArticleCount { get; set; }
        public decimal MonthlyEarnings { get; set; }
        public int TotalTransactions { get; set; }
        public List<PaymentMethodStatDto> PaymentStats { get; set; }
        public List<WeeklyStatDto> WeeklyStats { get; set; }
    }
}
