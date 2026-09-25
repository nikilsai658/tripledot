import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Superadmin } from '../../../features/services/superadmin/superadmin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadmin-domain-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-domain-students.html',
  styleUrl: './superadmin-domain-students.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminDomainStudents implements OnInit {

  students: any[] = [];

  loading = false;

  collegeId!: number;
  domainId!: number;
  domainName = '';

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;

    if (this.collegeId && this.domainId) {
      this.loadDomainStudents();
    }
  }

  loadDomainStudents(): void {

    this.loading = true;

    this.api
      .getsuperadmincollege_domain_students(
        this.collegeId,
        this.domainId
      )
      .subscribe({

        next: (res: any) => {

          console.log('Students Response:', res);

          this.students = res?.data ?? [];

          this.loading = false;

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error(
            'Error loading domain students:',
            error
          );

          this.students = [];

          this.loading = false;

          this.cd.markForCheck();
        }

      });
  }
 viewAssignments(student: any): void {
  this.router.navigate(
    ['/main/superadmin-student-assignments'],
    {
      state: {
        studentId: student.studentId,
        collegeId: this.collegeId,
        domainId: this.domainId,
      }
    }
  );
}
 viewTasks(student: any): void {
  this.router.navigate(
    ['/main/superadmin-student-tasks'],
    {
      state: {
        studentId: student.studentId,
        collegeId: this.collegeId,
        domainId: this.domainId,
      }
    }
  );
}
printContent(): void {
  const printContent = document.getElementById('print-section');

  if (!printContent) {
    console.error('Print section not found');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    alert('Please allow popups for this website.');
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>User Details</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h2 {
            margin-bottom: 20px;
          }

          p {
            margin: 10px 0;
            font-size: 15px;
          }

          strong {
            display: inline-block;
            width: 120px;
          }

          @media print {
            body {
              padding: 20px;
            }
          }
        </style>

      </head>

      <body>

        ${printContent.innerHTML}

      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}
}