import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Student } from '../../../features/services/student/student';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-assignments.html',
  styleUrl: './student-assignments.css'
})
export class StudentAssignments implements OnInit {

  domainId!: number;
  courseId!: number;
  assignments:any[]=[];
  tasks:any[]=[];
  loading = true;
  constructor(private route: ActivatedRoute,private api:Student,private cd:ChangeDetectorRef, private router:Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.domainId = history.state.domainId;
      this.courseId = history.state.courseId;
      this.loadAssignments();
    }
  }
  loadAssignments():void{
   this.api.getstudentcourseById(this.domainId, this.courseId).subscribe({
    next:(res:any)=>{
      console.log(res.data)
        this.assignments=res?.data??[];
        if (this.assignments.length === 0) {
          this.loadTasks();
          return;
        }
        this.loading=false;
        this.cd.detectChanges();
    },error:(err:any)=>{
       this.assignments = [];
       console.log(err);
       this.loadTasks();
    }
   })
  }

  openTask(task: any): void {
    // The list item's id field name isn't fixed, so try the likely ones.
    const taskId = task?.id ?? task?.studentTaskId ?? task?.taskId;
    if (taskId == null) {
      console.error('Task has no id field, item received:', task);
      return;
    }
    this.router.navigate(['/main/student-task'], {
      state: { taskId, domainId: this.domainId, courseId: this.courseId }
    });
  }

  // Only reached when the course has no assignments; tasks are shown instead.
  loadTasks():void{
    this.api.getstudenttasks(this.domainId, this.courseId).subscribe({
      next:(res:any)=>{
        this.tasks=res?.data??[];
        this.loading=false;
        this.cd.detectChanges();
      },error:()=>{
        this.tasks=[];
        this.loading=false;
        this.cd.detectChanges();
      }
    })
  }
  startAssignment(id: number): void {
  const assignmentIds = this.assignments.map(a => a.assignmentId);

  // Marks entry as coming from a real "Start" click, so assignmentGuard
  // allows the student-assignment route and the lock/fullscreen can engage.
  sessionStorage.setItem('activeAssignmentId', id.toString());

  document.documentElement.requestFullscreen?.().catch(() => {});

  this.router.navigate(
    ['/main/student-assignment'],
    {
      state: {
        Id: id,
        assignmentIds: assignmentIds
      }
    }
  );
}


















































  
}