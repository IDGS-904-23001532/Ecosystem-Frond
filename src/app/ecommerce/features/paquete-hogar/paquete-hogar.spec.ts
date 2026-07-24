import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaqueteHogar } from './paquete-hogar';

describe('PaqueteHogar', () => {
  let component: PaqueteHogar;
  let fixture: ComponentFixture<PaqueteHogar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteHogar],
    }).compileComponents();

    fixture = TestBed.createComponent(PaqueteHogar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
