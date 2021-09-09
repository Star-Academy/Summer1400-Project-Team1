import { TestBed } from '@angular/core/testing';

import { StoredDataService } from './stored-data.service';

describe('StoredDataService', () => {
  let service: StoredDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoredDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
