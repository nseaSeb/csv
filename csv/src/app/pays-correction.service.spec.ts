import { TestBed } from '@angular/core/testing';

import { PaysCorrectionService } from './pays-correction.service';

describe('PaysCorrectionService', () => {
  let service: PaysCorrectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaysCorrectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
