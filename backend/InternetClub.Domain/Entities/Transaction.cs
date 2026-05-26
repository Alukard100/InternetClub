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
        public User User { get; private set; } = null!;
        public decimal Amount { get; private set; }
        public string Currency { get; private set; } = "BAM";
        public TransactionType TransactionType { get; private set; }
        public DateTimeOffset Date { get; private set; }
        protected Transaction() { }
        public Transaction(Guid userId, decimal amount, TransactionType transactiontype)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            Amount = amount;
            TransactionType = transactiontype;
            Date = DateTimeOffset.UtcNow;
        }
    }
}
