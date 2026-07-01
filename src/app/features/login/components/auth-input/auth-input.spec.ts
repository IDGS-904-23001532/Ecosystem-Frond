import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInputComponent } from './auth-input.component';

describe('AuthInput', () => {
  let component: AuthInputComponent;
  let fixture: ComponentFixture<AuthInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
