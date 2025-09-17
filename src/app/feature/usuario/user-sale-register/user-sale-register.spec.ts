import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSaleRegister } from './user-sale-register';

describe('UserSaleRegister', () => {
  let component: UserSaleRegister;
  let fixture: ComponentFixture<UserSaleRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSaleRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSaleRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
