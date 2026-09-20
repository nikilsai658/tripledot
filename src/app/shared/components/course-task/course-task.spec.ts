import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTask } from './course-task';

describe('CourseTask', () => {
  let component: CourseTask;
  let fixture: ComponentFixture<CourseTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseTask],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseTask);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
