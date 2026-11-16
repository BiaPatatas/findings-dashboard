import { TestBed } from '@angular/core/testing';

import { Findings } from './findings';

describe('Findings', () => {
  let service: Findings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Findings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
