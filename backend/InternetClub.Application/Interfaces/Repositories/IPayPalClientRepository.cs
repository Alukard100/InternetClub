using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Repositories
{
    public interface IPayPalClientRepository
    {
        Task<string> GetAccessTokenAsync();
    }
}
