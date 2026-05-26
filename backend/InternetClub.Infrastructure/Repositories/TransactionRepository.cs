using InternetClub.Application.DTOs.Transaction;
using InternetClub.Application.Interfaces.Repositories;
using InternetClub.Domain.Entities;
using InternetClub.Domain.Enums;
using InternetClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly InternetClubDbContext _db;
        private IDbContextTransaction _transaction;
        public TransactionRepository(InternetClubDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Transaction t)
        {
            _db.Add(t);
            await _db.SaveChangesAsync();
        }

        public async Task<int> CountAsync(TransactionFilter filter)
        {
            var query = _db.Transactions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Username))
                query = query.Where(t => t.User.Username.Contains(filter.Username)).AsQueryable();

            if (filter.Type.HasValue && !filter.Type.Value.Equals(TransactionType.Invalid))
                query = query.Where(t => t.TransactionType == filter.Type.Value);

            if (filter.StartDate.HasValue)
            {
                query = query.Where(t => t.Date >= filter.StartDate.Value);
            }

            if (filter.EndDate.HasValue)
            {
                var endExclusive = filter.EndDate.Value.AddDays(1);
                query = query.Where(t => t.Date <= endExclusive);
            }

            return await query.CountAsync();
        }


        public async Task<List<Transaction>> GetTransactionsAsync(TransactionFilter filter ,int skip, int take)
        {
            var query = _db.Transactions.Include(t => t.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Username))
                query = query.Where(t => t.User.Username.Contains(filter.Username)).AsQueryable();

            if (filter.Type.HasValue && !filter.Type.Value.Equals(TransactionType.Invalid))
                query = query.Where(t => t.TransactionType == filter.Type.Value);

            if (filter.StartDate.HasValue)
            {
                query = query.Where(t => t.Date >= filter.StartDate.Value);
            }

            if (filter.EndDate.HasValue)
            {
                var endExclusive = filter.EndDate.Value.AddDays(1);
                query = query.Where(t => t.Date <= endExclusive);
            }


            return await query
                .OrderByDescending(t => t.Date)
                .Skip(skip)
                .Take(take)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task TransactionBeginAsync()
        {
            _transaction = await _db.Database.BeginTransactionAsync();
        }

        public async Task TransactionCommitAsync()
        {
            if (_transaction == null)
                throw new InvalidOperationException("No transaction started");

            await _db.SaveChangesAsync();
            await _transaction.CommitAsync();
        }

        public async Task TransactionRollbackAsync()
        {
            await _transaction.RollbackAsync();
        }
    }
}
