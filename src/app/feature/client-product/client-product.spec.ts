import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProduct } from './client-product';

describe('ClientProduct', () => {
  let component: ClientProduct;
  let fixture: ComponentFixture<ClientProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
