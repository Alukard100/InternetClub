using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public decimal Amount { get; private set; }
        public TransactionType Type { get; private set; }
        public DateTime Date { get; private set; }
        protected Transaction() { }
        public Transaction(Guid userId, decimal amount, TransactionType type)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Amount = amount;
            Type = type;
            Date = DateTime.UtcNow;
        }
    }
}
