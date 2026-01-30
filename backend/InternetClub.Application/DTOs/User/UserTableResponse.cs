using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.User
{
    public class UserTableResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public decimal TotalMoneySpent { get; set; }
        public  Status Status { get; set; }
        public int AvailableMinutes { get; set; }
    }
}
