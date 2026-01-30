using InternetClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Infrastructure.Persistence
{
    public class InternetClubDbContext : DbContext
    {
        public InternetClubDbContext(DbContextOptions<InternetClubDbContext> options) : base(options) { }

        public DbSet<Article> Articles => Set<Article>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(u => u.TotalMoneySpent)
                      .HasPrecision(18, 2);
            });
        }

    }
}
