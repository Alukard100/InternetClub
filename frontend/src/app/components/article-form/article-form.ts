import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ArticlesService } from '../../services/articles/articles';
import { Article, ArticleType } from '../../interfaces/article';
import { ActivatedRoute, Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material';
import { FormsModule, NgModel } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { RichTextEditor } from "../rich-text-editor/rich-text-editor";
import { Images } from '../../services/images/images';

@Component({
  selector: 'app-article-form',
  imports: [
    MATERIAL_IMPORTS,
    FormsModule,
    ImageCropperComponent,
    RichTextEditor
],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm implements OnInit {

  ArticleType!: ArticleType;

  article: Article = {
    id: '',
    title: '',
    content: '',
    published: false,
    slug: '',
    thumbnailPath: '',
    type: 0,
    createdAt: new Date(),
  };

  // -- State for edit mode
  slug: string | null = null;
  isEditMode = false;
  imagePath: string = 'https://localhost:7061/';
  // -- Thumbnail upload state
  isDragging: boolean = false;
  newThumbnail: string = '';
  newFile: File | undefined;
  isImgExpanded: boolean = true;
  // -- Cropper States
  imageChangedEvent: any;
  croppedImage: string = '';
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;

  constructor(private articleService: ArticlesService, private imageService: Images, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');

    if (this.slug) {
      this.isEditMode = true;
      this.loadArticle(this.slug);
    }
  }

  loadArticle(slug: string) {
    this.articleService.getArticlesBySlug(slug).subscribe(article => {
      this.article = article;
      this.article.thumbnailPath = this.normalizePath(this.article.thumbnailPath);
      this.cdr.detectChanges();
    });
  }

  onThumbnailSelected(event: any) {
    const input = event.target.files[0];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {

    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onCancel() {
    this.newFile = undefined;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.newThumbnail = '';

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!this.validateImageFile(file)) {
      this.onCancel();
      alert('Invalid file type. Please select a .jpg, .jpeg, or .png image.');
      return;
    }

    this.newFile = file;

    const fakeEvent = {
      target: {
        files: [file]
      }
    };

    this.imageChangedEvent = fakeEvent;
    this.newThumbnail = 'loading';
  }

  validateImageFile(file: File): boolean {
    const allowedExtensions = ['.jpg', '.png', '.jpeg'];
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return allowedExtensions.includes(extension);
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (!event.blob) {
      alert('Failed to crop image. Please try again.');
      return;
    }

    this.newFile = new File([event.blob], 'thumbnail.png', { type: event.blob.type });
    this.newThumbnail = URL.createObjectURL(event.blob);

    if (!this.isEditMode) {
      this.createArticleFlow(); 
    } else {
        this.updateArticleFlow();
    }
  }

  toggleImageSection() {
    this.isImgExpanded = !this.isImgExpanded;
  }

  onImageLoaded() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }


  normalizePath(path: string): string {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path.replace(this.imagePath, '');
    }

    return path;
  }


  onSubmit() {

    if (this.article.title.trim() === '' || this.article.content.trim() === '') {
      alert('Title and content cannot be empty.');
      return;
    }

    if (this.imageChangedEvent && this.cropper) {
      this.cropper.crop();
      return;
    }

    if (!this.isEditMode) {
      this.createArticleFlow();
    } else if (this.isEditMode) {
      this.updateArticleFlow();
    }

  }

  createArticleFlow() {
    if (!this.newFile) {
      alert('Please select and crop a thumbnail image before submitting.');
      return;
    }

    this.imageService.uploadImage(this.newFile).subscribe({
      next: (imgRes) => {
        const payload = {
          title: this.article.title,
          content: this.article.content,
          thumbnailPath: this.normalizePath(imgRes.url),
          type: Number(this.article.type),
          published: this.article.published
        };
        this.articleService.createArticle(payload).subscribe({
          next: (created) => {
            this.router.navigate(['/articles/edit', created.slug]);
          },
          error: err => console.error(err)
        });
      },
      error: err => console.error(err)
    });

  }

  updateArticleFlow() {
    if (this.newFile) {
      this.imageService.uploadImage(this.newFile).subscribe({
        next: (imgRes) => {
          this.article.thumbnailPath = imgRes.url;
          this.preformUpdate();
        },
        error: err => console.error(err)
      });
    } else {
      this.preformUpdate();
    }
  }

  preformUpdate() {
    this.articleService.updateArticle({
      id: this.article.id,
      title: this.article.title,
      content: this.article.content,
      type: this.article.type,
      thumbnailPath: this.article.thumbnailPath,
      published: this.article.published
    }).subscribe({
      next: () => {
        this.loadArticle(this.article.slug);
      },
      error: err => console.error(err)
    });
  }

  returnBack() {
    this.router.navigate(["/articles"]);
  }
}
