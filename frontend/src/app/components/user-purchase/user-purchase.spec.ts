import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPurchase } from './user-purchase';

describe('UserPurchase', () => {
  let component: UserPurchase;
  let fixture: ComponentFixture<UserPurchase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPurchase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPurchase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
