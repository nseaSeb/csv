import { TestBed } from '@angular/core/testing';

import { MatchingColumnsService } from './matching-columns.service';

describe('MatchingColumnsService', () => {
  let service: MatchingColumnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchingColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
