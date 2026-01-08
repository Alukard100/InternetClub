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
        
    }
}
