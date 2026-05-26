using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Interfaces.Abstraction
{
    public interface IImageStorageService
    {
        Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    }
}
