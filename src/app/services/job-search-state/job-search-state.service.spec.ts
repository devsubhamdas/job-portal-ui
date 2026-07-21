import { TestBed } from '@angular/core/testing';

import { JobSearchStateService } from './job-search-state.service';

describe('JobSearchStateService', () => {
  let service: JobSearchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSearchStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
