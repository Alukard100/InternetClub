using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.User
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public UserRole UserRole { get; set; }
        public DateTime CreatedAt { get; set; }
        public int AvailableMinutes { get; set; }
    }
}
