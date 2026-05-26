import { Component, OnInit } from '@angular/core';
import { RichTextEditor } from '../rich-text-editor/rich-text-editor';
import { MATERIAL_IMPORTS } from '../../material';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Article, ArticleType } from '../../interfaces/article';
import { ArticlesService } from '../../services/articles/articles';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DeleteArticleDialog } from './delete-article-dialog/delete-article-dialog';
import { MatDialog } from '@angular/material/dialog';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-articles',
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})

export class Articles implements OnInit {

  ArticleType = ArticleType; // Expose enum to template

  searchControl = new FormControl('');

  displayColumns = ['title', 'createdAt', 'type', 'published', 'actions'];
  dataSource = new MatTableDataSource<Article>();

  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  search = '';

  

  constructor(private articleService: ArticlesService, private router: Router, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadArticles();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search = value || '';
      this.pageNumber = 1;
      this.loadArticles();
    }); 

    this.authService.getRole(); // Trigger role retrieval on component init to ensure it's available when needed
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getArticles(this.search, null, null, this.pageNumber, this.pageSize).subscribe(result => {
      this.dataSource.data = result.items;
      this.totalCount = result.totalCount;

    });
  }

  editArticle(article: Article) {
    this.router.navigate(['/articles/edit', article.slug]);
  }

  deleteArticle(article: Article) {
    const dialogRef = this.dialog.open(DeleteArticleDialog, {
      width : '400px',
      data: article.id
    });

    dialogRef.afterClosed().subscribe(result => { 
      if (result) {
        this.loadArticles();
      }
    });
  }

  openAddNewArticle() {
    this.router.navigate(['/articles/create']);
  }
}
