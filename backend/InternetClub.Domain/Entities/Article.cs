using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Domain.Entities
{
    public class Article
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string ThumbnailPath { get; private set; }
        public string Content { get; private set; }
        public ArticleType Type { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? EditedOn { get; private set; }
        protected Article() { }
        public Article(string title, string thumbnailPath, string content, ArticleType type)
        {
            Id = Guid.NewGuid();
            Title = title;
            ThumbnailPath = thumbnailPath;
            Content = content;
            Type = type;
            CreatedAt = DateTime.UtcNow;
            EditedOn = null;
        }
    }
}
