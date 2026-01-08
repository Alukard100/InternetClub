using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Article
{
    public class CreateArticleRequest
    {
        public string Title { get; set; } = null;
        public string ThumbnailPath { get; set; } = null;
        public string Content { get; set; } = null;
    }
}
