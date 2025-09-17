import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteInterfas } from './cliente-interfas';

describe('ClienteInterfas', () => {
  let component: ClienteInterfas;
  let fixture: ComponentFixture<ClienteInterfas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteInterfas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteInterfas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
