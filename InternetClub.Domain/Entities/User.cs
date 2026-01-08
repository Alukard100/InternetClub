using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Username { get; private set; }
        public string PasswordHash { get; private set; }
        public Status Status { get; private set; }
        public int AvailableMinutes { get; private set; }
        public decimal TotalMoneySpent { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? EditedAt { get; private set; }
        public UserRole Role { get; private set; }
        protected User() { }
        public User(string username, string passwordHash)
        {
            Id = Guid.NewGuid();
            Username = username;
            PasswordHash = passwordHash;
            Status = Status.Offline;
            AvailableMinutes = 0;
            TotalMoneySpent = 0m;
            CreatedAt = DateTime.UtcNow;
            Role = UserRole.User;
            EditedAt = null;
        }
    }
}
