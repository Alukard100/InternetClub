import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticlesService } from '../../services/articles/articles';
import { Article, ArticleType } from '../../interfaces/article';
import { ArticleCard } from "../article-card/article-card";
import { MATERIAL_IMPORTS } from '../../material';
import { AuthService } from '../../services/auth/auth-service';
import { UsersService } from '../../services/users/users';
import { User } from '../../interfaces/user';
import { UserTimePipe } from '../../pipes/user-time/user-time-pipe';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ArticleCard,
    MATERIAL_IMPORTS,
    UserTimePipe,
    NgClass
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  ArticleType = ArticleType; // Expose enum to template

  //pagination
  totalCount = 0;
  pageNumber = 1;
  pageSize = 4;
  search = ''; //wont be used in home but we need it for articles component
  typeFilter: ArticleType | null = null;

  articleTypes = [
    { label: 'All', value: null },
    { label: 'Games', value: ArticleType.Games },
    { label: 'Information', value: ArticleType.Information },
    { label: 'Tournament', value: ArticleType.Tournament }
  ];

  user: User | null = null;

  now = Date.now();

  imagePath: string = 'https://localhost:7061/';

  articles: Article[] = [];

  constructor(private articlesService: ArticlesService, private cdr: ChangeDetectorRef, public auth: AuthService, private userService: UsersService, private router: Router) { }

  ngOnInit(): void {

    setInterval(() => {
      this.now = Date.now();
      this.cdr.markForCheck();
    }, 500);

    this.getArticles();

    this.auth.loggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn && this.auth.isUser()) {
        this.userService.getMe().subscribe({
          next: res => {
            this.user = res;
          },
          error: err => console.error(err)
        });
      } else {
        this.user = null;
      }
    })
  }

  getArticles() {
    this.articlesService.getArticles(this.search, true, this.typeFilter, this.pageNumber, this.pageSize).subscribe({
      next: res => {
        this.articles = res.items;
        this.totalCount = res.totalCount;
      },
      error: err => console.error('Failed to fetch articles', err)
    });
  }


  normalizePath(path: string): string { // Helper function to normalize image paths to support both absolute and relative paths
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path.replace(this.imagePath, '');
    }

    return path;
  }

  // PAGINATION SECTION
  onTypeFilterChange() {
    this.pageNumber = 1; // Reset to first page when filter changes
    this.getArticles();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.getArticles();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getArticles();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getArticles();
    }
  }

  firstPage() {
    this.pageNumber = 1;
    this.getArticles();
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.getArticles();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  AddFunds() {
    this.router.navigate(['/purchase']);
  }


}
