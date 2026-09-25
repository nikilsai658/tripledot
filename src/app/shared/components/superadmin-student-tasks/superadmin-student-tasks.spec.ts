import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminStudentTasks } from './superadmin-student-tasks';

describe('SuperadminStudentTasks', () => {
  let component: SuperadminStudentTasks;
  let fixture: ComponentFixture<SuperadminStudentTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminStudentTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminStudentTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
