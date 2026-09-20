import { TestBed } from '@angular/core/testing';

import { CourseTaskService } from './course-task-service';

describe('CourseTaskService', () => {
  let service: CourseTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
