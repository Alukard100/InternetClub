using InternetClub.Application.DTOs.Dashboard;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Domain.Enums;
using InternetClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly InternetClubDbContext _db;

        public DashboardRepository(InternetClubDbContext db) 
        {
            _db = db;
        }

        public async Task<decimal> GetMonthlyEarningAsync()
        {
            return await _db.Transactions
                .Where(t => t.Date.Month == DateTime.UtcNow.Month &&
                            t.Date.Year == DateTime.UtcNow.Year)
                .SumAsync(t => t.Amount);
        }

        public async Task<List<PaymentMethodStatDto>> GetPaymentMethodCountAsync()
        {
            return await _db.Transactions
                    .Where(t => t.TransactionType != TransactionType.Invalid)
                    .GroupBy(t => t.TransactionType)
                    .Select(g => new PaymentMethodStatDto
                    {
                        Method = g.Key.ToString(),
                        Count = g.Count()
                    })
                    .ToListAsync();
        }

        public async Task<List<WeeklyStatDto>> GetWeeklyStatsAsync()
        {
            var firstTransactionDate = await _db.Transactions
                .OrderBy(t => t.Date)
                .Select(t => t.Date)
                .FirstOrDefaultAsync();

            if (firstTransactionDate == default)
                return new List<WeeklyStatDto>();

            var today = DateTime.UtcNow;

            var transactions = await _db.Transactions
                .Select(t => new { t.Date, t.Amount })
                .ToListAsync();

            var groupedData = transactions
                .GroupBy(t => t.Date.DayOfWeek)
                .Select(g => new
                {
                    Day = g.Key,
                    TransactionCount = g.Count(),
                    Earnings = g.Sum(x => x.Amount)
                })
                .ToList();

            var orderedDays = new[]
            {
                DayOfWeek.Monday,
                DayOfWeek.Tuesday,
                DayOfWeek.Wednesday,
                DayOfWeek.Thursday,
                DayOfWeek.Friday,
                DayOfWeek.Saturday,
                DayOfWeek.Sunday
            };

            var result = new List<WeeklyStatDto>();

            foreach (var day in orderedDays)
            {
                var totalDays = CountDaysBetween(firstTransactionDate.Date, today.Date, day);

                var data = groupedData.FirstOrDefault(x => x.Day == day);

                result.Add(new WeeklyStatDto
                {
                    Day = day.ToString().Substring(0, 3),
                    TransactionCount = totalDays == 0 ? 0 : Math.Round((decimal)(data?.TransactionCount ?? 0) / totalDays, 2),
                    Earnings = totalDays ==  0 ? 0 : Math.Round((data?.Earnings ?? 0) / totalDays, 2)
                });
            }

            return result;

        }

        private int CountDaysBetween(DateTime start, DateTime end, DayOfWeek targetDay)
        {
            int count = 0;
            for (var date = start; date <= end; date = date.AddDays(1))
            {
                if (date.DayOfWeek == targetDay) count++;
            }
            return count;
        }
    }
}
