using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.User
{
    public class CreateUserRequest
    {
        public string Username { get; set; } = null;
        public string Password { get; set; } = null;
    }
}
