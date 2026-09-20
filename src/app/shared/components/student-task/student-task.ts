import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Student } from '../../../features/services/student/student';

@Component({
  selector: 'app-student-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-task.html',
  styleUrl: './student-task.css',
})
export class StudentTask implements OnInit {

  taskId!: number;
  domainId!: number;
  courseId!: number;
  task: any = null;
  loading = true;
  uploading = false;

  constructor(
    private api: Student,
    private router: Router,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.taskId = history.state.taskId;
    this.domainId = history.state.domainId;
    this.courseId = history.state.courseId;

    if (this.taskId == null) {
      this.router.navigate(['/main/student-assignments'], {
        state: { domainId: this.domainId, courseId: this.courseId }
      });
      return;
    }

    this.loadTask();
  }

  loadTask(): void {
    this.api.gettaskbyId(this.taskId).subscribe({
      next: (res: any) => {
        this.task = res?.data ?? null;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.task = null;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  back(): void {
    this.router.navigate(['/main/student-assignments'], {
      state: { domainId: this.domainId, courseId: this.courseId }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.api.uploadtask(this.taskId, file).subscribe({
      next: () => {
        this.uploading = false;
        input.value = '';
        this.loadTask();
      },
      error: () => {
        this.uploading = false;
        input.value = '';
        this.cd.detectChanges();
      }
    });
  }

  download(): void {
    this.api.downloadtask(this.taskId).subscribe({
      next: (res: any) => {
        const blob: Blob = res.body;
        const disposition: string = res.headers?.get('content-disposition') ?? '';
        const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
        const fileName = match ? decodeURIComponent(match[1]) : (this.task?.taskTitle || 'task');

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }
}
