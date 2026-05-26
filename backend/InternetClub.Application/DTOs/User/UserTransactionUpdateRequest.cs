using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.User
{
    public class UserTransactionUpdateRequest
    {
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
    }
}
