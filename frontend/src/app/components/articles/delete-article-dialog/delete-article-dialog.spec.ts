import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteArticleDialog } from './delete-article-dialog';

describe('DeleteArticleDialog', () => {
  let component: DeleteArticleDialog;
  let fixture: ComponentFixture<DeleteArticleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteArticleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteArticleDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
