import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaContacto } from './cta-contacto';

describe('CtaContacto', () => {
  let component: CtaContacto;
  let fixture: ComponentFixture<CtaContacto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaContacto],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaContacto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
