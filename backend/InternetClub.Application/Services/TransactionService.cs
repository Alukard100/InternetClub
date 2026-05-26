using InternetClub.Application.Common.Pagination;
using InternetClub.Application.DTOs.Transaction;
using InternetClub.Application.DTOs.User;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Application.Interfaces.Services;
using InternetClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repo;
        private readonly IUserService _userService;

        public TransactionService(ITransactionRepository repo, IUserService userService)
        {
            _repo = repo;
            _userService = userService;
        }

        public async Task<bool> CreateTransactionReceiptAsync(TransactionRequest request)
        {
            var transaction = new Transaction(request.UserId, request.Amount, request.Type);

            var UpdateTrans = new UserTransactionUpdateRequest
            {
                Amount = request.Amount,
                UserId = request.UserId
            };

            await _repo.TransactionBeginAsync();

            try
            {
                await _repo.AddAsync(transaction);

                await _userService.UserTransactionUpdateAsync(UpdateTrans);

                await _repo.TransactionCommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await _repo.TransactionRollbackAsync();
                Console.WriteLine(ex.ToString());
                return false;
            }
            
        }

        public async Task<PagedResult<TransactionResponse>> GetAllTransactionsAsync(TransactionFilter filter, PagingParameters paging)
        {
            var skip = (paging.PageNumber - 1) * paging.PageSize;

            var totalCount = await _repo.CountAsync(filter);

            var transactions = await _repo.GetTransactionsAsync(filter, skip, paging.PageSize);

            var result = transactions.Select(t => new TransactionResponse
            {
                Id = t.Id,
                UserId = t.UserId,
                Username = t.User.Username,
                Amount = t.Amount,
                Currency = t.Currency,
                TransactionType = t.TransactionType,
                Date = t.Date
            }).ToList();

            return new PagedResult<TransactionResponse>
            {
                TotalCount = totalCount,
                Items = result
            };
        }
    }
}
