import { TestBed } from '@angular/core/testing';

import { Prospecto } from './prospecto';

describe('Prospecto', () => {
  let service: Prospecto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prospecto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
