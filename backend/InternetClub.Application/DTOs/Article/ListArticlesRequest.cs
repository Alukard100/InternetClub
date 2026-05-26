using InternetClub.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InternetClub.Application.DTOs.Article
{
    public class ListArticlesRequest
    {
        public string? TitleFilter { get; set; }
        public bool? PublishedFilter { get; set; }
        public ArticleType? TypeFilter { get; set; }
    }
}
