using InternetClub.Application.Interfaces.Abstraction;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.Services
{
    public class LocalImageStorageService : IImageStorageService
    {
        private readonly string _imageDirectory;
        private readonly IConfiguration _configuration;
        public LocalImageStorageService(IConfiguration configuration)
        {
            _configuration = configuration;

            _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), _configuration["ImageSettings:ImageDirectory"]);

            if (!Directory.Exists(_imageDirectory))
                Directory.CreateDirectory(_imageDirectory);
        }

        
        public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType)
        {
            var extension = Path.GetExtension(fileName);
            var uniqueName = $"{Guid.NewGuid()}{extension}";

            var fullPath = Path.Combine(_imageDirectory, uniqueName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream);
            }

            return $"https://localhost:7061/images/{uniqueName}";
        }
    }
}
