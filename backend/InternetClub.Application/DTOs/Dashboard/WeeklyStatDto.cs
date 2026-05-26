using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Dashboard
{
    public class WeeklyStatDto
    {
        public string Day { get; set; }
        public decimal TransactionCount { get; set; }
        public decimal Earnings { get; set; }
    }
}
