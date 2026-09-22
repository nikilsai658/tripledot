import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskSubmission } from './student-task-submission';

describe('StudentTaskSubmission', () => {
  let component: StudentTaskSubmission;
  let fixture: ComponentFixture<StudentTaskSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTaskSubmission],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTaskSubmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
