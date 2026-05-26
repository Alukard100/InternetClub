using InternetClub.Application.DTOs.Transaction;
using InternetClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Repositories
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetTransactionsAsync(TransactionFilter filter, int skip, int take);
        Task<int> CountAsync(TransactionFilter filter);
        Task AddAsync(Transaction t);
        Task TransactionBeginAsync();
        Task TransactionCommitAsync();
        Task TransactionRollbackAsync();
    }
}
