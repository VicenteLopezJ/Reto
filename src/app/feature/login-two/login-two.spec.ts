import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTwo } from './login-two';

describe('LoginTwo', () => {
  let component: LoginTwo;
  let fixture: ComponentFixture<LoginTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
