using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace InternetClub.Domain.Entities
{
    public class Article
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Slug { get; private set; }
        public string ThumbnailPath { get; private set; }
        public string Content { get; private set; }
        public ArticleType Type { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? EditedOn { get; private set; }
        public bool Published { get; private set; }
        protected Article() { }

        public Article(string title, string thumbnailPath, string content, ArticleType type, bool published)
        {
            Id = Guid.NewGuid();
            Title = title;
            Slug = GenerateSlug(title);
            ThumbnailPath = thumbnailPath;
            Content = content;
            Type = type;
            CreatedAt = DateTime.UtcNow;
            Published = published;
        }

        public void UpdateContent(string title, string content, ArticleType type, string thumbnail, bool published)
        {
            Title = title;
            Content = content;
            Type = type;
            ThumbnailPath = thumbnail;
            EditedOn = DateTime.UtcNow;
            Published = published;
        }

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return string.Empty;

            string normalized = title.ToLowerInvariant();

            var replacements = new Dictionary<string, string>
            {
                ["č"] = "c",
                ["ć"] = "c",
                ["ž"] = "z",
                ["š"] = "s",
                ["đ"] = "d",
                ["ä"] = "a",
                ["ö"] = "o",
                ["ü"] = "u",
                ["ß"] = "ss"
            };

            foreach (var kvp in replacements)
            {
                normalized = normalized.Replace(kvp.Key, kvp.Value);
            }

            normalized = Regex.Replace(normalized, @"[^a-z0-9\s-]", "");
            normalized = Regex.Replace(normalized, @"\s+", "-");
            normalized = Regex.Replace(normalized, @"-+", "-");
            normalized = normalized.Trim('-');

            return normalized;
        }

        public void SetSlug(string slug)
        {
            Slug = slug;
        }
    }
}
