import { ChangeDetectorRef, Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Studentassignment } from '../../../features/services/studentassignment/studentassignment';
import { Auth } from '../../../core/auth/auth';
import { Feedback } from '../../feedback/feedback';

@Component({
  selector: 'app-student-assignment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './studentassignment.html',
  styleUrls: ['./studentassignment.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentAssignment implements OnInit {

  feedback = new Feedback();

  assignmentForm!: FormGroup;
  assignments: any[] = [];

  editMode = false;
  selectedId!: number;

  constructor(
    private fb: FormBuilder,
    private studentService: Studentassignment,
    private cdr: ChangeDetectorRef,
    public auth:Auth
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAssignments();
  }

  initializeForm(): void {
    this.assignmentForm = this.fb.group({
      id: [0],

      studentEmail: ['', Validators.required],
      courseName: ['', Validators.required],
      assignmentTitle: ['', Validators.required],
      status: ['', Validators.required],

      startedOn: [null],
      completedOn: [null],

      score: [0, Validators.required],
      attempts: [1, Validators.required],

      bestSubmissionId: [''],
      lastSubmissionId: [''],
      timeTaken: [0, Validators.required],

      isPassed: [false]
    });
  }

  // Get All
  getAssignments(): void {
    this.studentService.getstudentassignment().subscribe({
      next: (res: any) => {
        this.assignments = res.data || res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Edit
  edit(id: number): void {

    this.studentService.getstudentassignmentById(id).subscribe({
      next: (res: any) => {

        const data = res.data || res;

        this.assignmentForm.patchValue(data);
        this.selectedId = id;
        this.editMode = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });

  }

update(): void {

  if (this.assignmentForm.invalid) {
    this.assignmentForm.markAllAsTouched();
    return;
  }

  const formValue = this.assignmentForm.value;

  const payload = {
    id: formValue.id,
    studentEmail: formValue.studentEmail,
    courseName: formValue.courseName,
    assignmentTitle: formValue.assignmentTitle,
    status: formValue.status,
    startedOn: formValue.startedOn,
    completedOn: formValue.completedOn,
    score: formValue.score,
    attempts: formValue.attempts,
    bestSubmissionId: formValue.bestSubmissionId
      ? String(formValue.bestSubmissionId)
      : "",
    lastSubmissionId: formValue.lastSubmissionId
      ? String(formValue.lastSubmissionId)
      : "",
    timeTaken: formValue.timeTaken,
    isPassed: formValue.isPassed
  };

  console.log(payload);

  this.studentService
    .updatestudentassignment(this.selectedId, payload)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.getAssignments();
        this.cancel();
        this.feedback.ok('Record updated successfully');
      },
      error: (err) => {
        this.feedback.fail(err, 'Failed to update record');
      }
    });
}
  // Delete
  delete(id: number): void {

    if (!confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    this.studentService
      .deletestudentassignmnet(id)
      .subscribe({
        next: () => {
          this.feedback.ok('Record deleted successfully');
          this.getAssignments();

        },
        error: (err) => this.feedback.fail(err, 'Failed to delete record')
      });

  }

  // Save (Create or Update)
  save(): void {
    if (this.editMode) {
      this.update();
    } else{

    }
  }

  // Reset Form
  cancel(): void {

    this.editMode = false;
    this.selectedId = 0;

    this.assignmentForm.reset();

    this.assignmentForm.patchValue({
      id: 0,
      score: 0,
      attempts: 1,
      timeTaken: 0,
      isPassed: false
    });
  }

}