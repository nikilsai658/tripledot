import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Superadmin } from '../../../features/services/superadmin/superadmin';

@Component({
  selector: 'app-superadmin-student-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-student-tasks.html',
  styleUrl: './superadmin-student-tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminStudentTasks implements OnInit {

  tasks: any[] = [];

  loading = false;

  // taskId currently being downloaded
  downloadingId: any = null;

  collegeId!: number;
  domainId!: number;
  studentId!: string;

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    // Get data passed through router state
    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;
    this.studentId = history.state.studentId;

    if (
      this.collegeId &&
      this.domainId &&
      this.studentId
    ) {
      this.loadStudentTasks();
    } else {
      console.error('Required student task details are missing.');
    }
  }

  loadStudentTasks(): void {

    this.loading = true;

    this.api
      .getsuperadmincollege_domain_student_tasks(
        this.collegeId,
        this.domainId,
        this.studentId
      )
      .subscribe({

        next: (res: any) => {

          console.log('Student Tasks Response:', res);

          this.tasks = res?.data ?? [];

          this.loading = false;

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error('Error loading student tasks:', error);

          this.tasks = [];

          this.loading = false;

          this.cd.markForCheck();
        }

      });
  }

  download(task: any): void {

    this.downloadingId = task.taskId;
    this.cd.markForCheck();

    this.api
      .downloadsuperadmincollege_domain_student_task(
        this.collegeId,
        this.domainId,
        this.studentId,
        task.taskId
      )
      .subscribe({

        next: (res: any) => {
          const blob: Blob = res.body;
          const disposition: string = res.headers?.get('content-disposition') ?? '';
          const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
          const fileName = match ? decodeURIComponent(match[1]) : (task.taskTitle || task.title || 'task');

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);

          this.downloadingId = null;
          this.cd.markForCheck();
        },

        error: (error) => {

          console.error('Error downloading task:', error);

          this.downloadingId = null;

          this.cd.markForCheck();
        }

      });
  }

}
