using InternetClub.Application.Interfaces.Abstraction;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        private readonly PasswordHasher<object> _hasher = new();
        public string Hash(string password)
            => _hasher.HashPassword(null!, password);


        public bool Verify(string password, string hash)
            => _hasher.VerifyHashedPassword(null!, hash, password)
                == PasswordVerificationResult.Success;
    }
}
