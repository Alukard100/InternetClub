using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Transaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Services
{
    public interface ITransactionService
    {
        Task<PagedResult<TransactionResponse>> GetAllTransactionsAsync(TransactionFilter filter, PagingParameters paging);
        Task<bool> CreateTransactionReceiptAsync(TransactionRequest request);

    }
}
