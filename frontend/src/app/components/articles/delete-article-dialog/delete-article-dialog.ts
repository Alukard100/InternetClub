import { Component, Inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticlesService } from '../../../services/articles/articles';

@Component({
  selector: 'app-delete-article-dialog',
  imports: [
    MATERIAL_IMPORTS
  ],
  templateUrl: './delete-article-dialog.html',
  styleUrl: './delete-article-dialog.scss',
})
export class DeleteArticleDialog {

  constructor(
    private dialogRef: MatDialogRef<DeleteArticleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private articleService: ArticlesService
  ) {}

  deleteArticle() {
    this.articleService.deleteArticle(this.data).subscribe({
      next: () =>  {this.dialogRef.close(true);},
      error: err => console.error(err)
    });
  }


}
