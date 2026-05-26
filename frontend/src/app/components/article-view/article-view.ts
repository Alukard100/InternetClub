import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ArticlesService } from '../../services/articles/articles';
import { Article } from '../../interfaces/article';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CustomImage } from '../rich-text-editor/custom-image.extension';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { MATERIAL_IMPORTS } from '../../material';

@Component({
  selector: 'app-article-view',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './article-view.html',
  styleUrl: './article-view.scss',
})
export class ArticleView implements OnInit {

  article: Article = {
    id: '',
    title: '',
    content: '',
    published: false,
    slug: '',
    thumbnailPath: '',
    type: 0,
    createdAt: new Date(),
  }

  slug: string | null = null;
  html!: SafeHtml;
  editor!: Editor;

  constructor(private articleService: ArticlesService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.loadArticle();
  }

  loadArticle() {
    if (this.slug != null) {
      this.articleService.getArticlesBySlug(this.slug).subscribe(article => {
        this.article = article;
        this.tiptapSpawn();
        
        this.cdr.detectChanges();
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  tiptapSpawn() {
    const json = JSON.parse(this.article.content);

    const tempEditor = new Editor({
      extensions: [
        StarterKit,
        CustomImage,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content: json,
    });

    const rawHtml = tempEditor.getHTML();

    const clean = DOMPurify.sanitize(rawHtml, {
        ALLOWED_ATTR: ['style', 'href', 'src', 'alt', 'width', 'height'],
        ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'u', 's', 'a', 'hr', 'br', 'ol', 'ul', 'li', 'pre', 'code', 'img', 'div'],
    });

    this.html = this.sanitizer.bypassSecurityTrustHtml(clean);

    tempEditor.destroy();

    
  }
  
  back() {
    this.router.navigate(["/"]);
  }



}
