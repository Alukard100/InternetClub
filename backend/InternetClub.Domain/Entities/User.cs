using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Data;
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
        public int AvailableSeconds { get; private set; }
        public DateTimeOffset? ExpiresAt { get; private set; }
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
            AvailableSeconds = 0;
            ExpiresAt = null;
            TotalMoneySpent = 0m;
            CreatedAt = DateTime.UtcNow;
            Role = UserRole.User;
            EditedAt = null;
        }

        public void Activate()
        {
            if (Status == Status.Online)
                return;

            if (AvailableSeconds <= 0)
                return;

            ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(AvailableSeconds);
            AvailableSeconds = 0;
            Status = Status.Online;
            EditedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            if (Status != Status.Online || ExpiresAt == null)
                return;

            var remaining = (int)(ExpiresAt.Value - DateTime.UtcNow).TotalSeconds;
            AvailableSeconds = Math.Max(remaining, 0);

            ExpiresAt = null;
            Status = Status.Offline;
            EditedAt = DateTime.UtcNow;
        }

        public void UpdateAmount(int time, decimal total)
        {
            if (Status == Status.Offline)
                AvailableSeconds += time;
            else if (Status == Status.Online && ExpiresAt != null)
                ExpiresAt = ExpiresAt.Value.AddSeconds(time);

            TotalMoneySpent = total;
        }

    }
}
