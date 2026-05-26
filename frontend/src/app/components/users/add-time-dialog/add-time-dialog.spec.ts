import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeDialog } from './add-time-dialog';

describe('AddTimeDialog', () => {
  let component: AddTimeDialog;
  let fixture: ComponentFixture<AddTimeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTimeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTimeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
