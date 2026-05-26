using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Article
{
    public class EditArticleRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public  ArticleType Type { get; set; }
        public string ThumbnailPath { get; set; }
        public bool Published { get; set; }
    }
}
