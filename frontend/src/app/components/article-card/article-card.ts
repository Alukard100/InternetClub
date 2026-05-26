import { Component, Input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material';
import { Article } from '../../interfaces/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS
  ],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
})
export class ArticleCard {
  @Input() article!: Article;
  imagePath: string = 'https://localhost:7061/';

  constructor(private router: Router) {}
  
  navigateToArticle() {
    this.router.navigate(['/article/view/' + this.article.slug]);
  }

  normalizePath(path: string): string { // Helper function to normalize image paths to support both absolute and relative paths
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path.replace(this.imagePath, '');
  }

    return path;
  }
}
