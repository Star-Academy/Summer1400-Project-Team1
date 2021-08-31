/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PipelineService } from './pipeline.service';

describe('Service: Pipeline', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipelineService]
    });
  });

  it('should ...', inject([PipelineService], (service: PipelineService) => {
    expect(service).toBeTruthy();
  }));
});
