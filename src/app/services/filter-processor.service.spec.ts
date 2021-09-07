import { TestBed } from '@angular/core/testing';

import { FilterProcessorService } from './filter-processor.service';

describe('FilterProcessorService', () => {
  let service: FilterProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
