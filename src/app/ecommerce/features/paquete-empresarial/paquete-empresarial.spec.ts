import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaqueteEmpresarial } from './paquete-empresarial';

describe('PaqueteEmpresarial', () => {
  let component: PaqueteEmpresarial;
  let fixture: ComponentFixture<PaqueteEmpresarial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteEmpresarial],
    }).compileComponents();

    fixture = TestBed.createComponent(PaqueteEmpresarial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
