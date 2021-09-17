/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PipelinePageService } from './pipeline-page.service';

describe('Service: PipelinePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipelinePageService]
    });
  });

  it('should ...', inject([PipelinePageService], (service: PipelinePageService) => {
    expect(service).toBeTruthy();
  }));
});
