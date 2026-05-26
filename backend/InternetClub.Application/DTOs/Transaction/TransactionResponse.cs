using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Transaction
{
    public class TransactionResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public TransactionType TransactionType { get; set; }
        public DateTimeOffset Date { get; set; }
    }
}
