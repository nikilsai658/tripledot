import { Routes } from '@angular/router';
import { Dashboard } from '../app/features/dashboard/dashboard';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';
import { Changepassword } from './features/changepassword/changepassword';
import { ProfilePage } from './features/profile-page/profile-page';
import { StudentDomain } from './shared/components/student-domain/student-domain';
import { StudentCourses } from './shared/components/student-courses/student-courses';
import { StudentAssignments } from './shared/components/student-assignments/student-assignments';
import { StudentAssignment } from './shared/components/student-assignment/student-assignment';
import { Department } from './shared/components/department/department';
import { Branch } from './shared/components/branch/branch';
import { DomainComponent } from './shared/components/domain/domain';
import { Course } from './shared/components/course/course';
import { Year } from './shared/components/year/year';
import { UserComponent } from './shared/components/user/user';
import { Permission } from './shared/components/permissions/permissions';
import { AssignmentComponent } from './shared/components/assignment/assignment';
import {  StudentProfile } from './shared/components/student-profile/student-profile';
import { College } from './shared/components/college/college';
import { Leadership } from './shared/components/leadership/leadership';
import { Certificate } from './shared/components/certificate/certificate';
import { Role } from './shared/components/role/role';
import { TicketComponent } from './shared/components/ticket/ticket';
import { MyTicketComponent } from './shared/components/mytickets/mytickets';
import { ReplyTicketComponent } from './shared/components/replyticket/replyticket';
import { AllTicketsComponent } from './shared/components/alltickets/alltickets';
import { SupportTicketDetailsComponent } from './shared/components/support-ticket-details/support-ticket-details';
import { CollegeDepartmentComponent } from './shared/components/collegedepartment/collegedepartment';
import { DepartmentBranchComponent } from './shared/components/departmentbranch/departmentbranch';
import { DomainCourseMapComponent } from './shared/components/domaincourse/domaincourse';
import { CourseAssignmentMapComponent } from './shared/components/courseassignment/courseassignment';
import { RolePermissionComponent } from './shared/components/rolepermission/rolepermission';
import { StudentAssignment as StudentAssignmentscore } from './shared/components/studentassignment/studentassignment';
import { StudentDomainMapComponent } from './shared/components/studentdomaincourse/studentdomaincourse';
import { SuperAdmin } from './shared/components/superadmin/superadmin';
import { SuperadminDomains } from './shared/components/superadmin-domains/superadmin-domains';
import { SuperadminDomainStudents } from './shared/components/superadmin-domain-students/superadmin-domain-students';
import { SuperadminStudentAssignments } from './shared/components/superadmin-student-assignments/superadmin-student-assignments';
import { SuperadminStudentAssignmentCode } from './shared/components/superadmin-student-assignment-code/superadmin-student-assignment-code';
import { YearUpdation } from './shared/components/year-updation/year-updation';
import { authGuard } from './core/auth/auth-guard';
import { assignmentGuard } from './core/guards/assignment-guard';
import { permissionGuard } from './core/guards/permission-guard';
import { NotFoundComponent } from './shared/components/page-not-found/page-not-found';
import { Viewcertificate } from './shared/components/viewcertificate/viewcertificate';
import { ChangePassword } from './shared/components/change-password/change-password';
import { Task } from './shared/components/task/task';
export const routes: Routes = [

  {
    path: '',redirectTo: 'home',pathMatch: 'full'
  },

  {
    path: 'home',component: Home
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-module')
        .then(m => m.AuthModule)
  },

  {
    path: 'main',component: Admin,canActivate: [authGuard],canActivateChild: [authGuard, permissionGuard],children: [

      {
        path: '',redirectTo: 'student-domain', pathMatch: 'full'
      },
      {
        path: 'student-domain', component: StudentDomain, data: { permission: 'VIEW_STUDENT_DOMAIN' }
      },

      {
        path: 'student-courses',component: StudentCourses
      },

      {
        path: 'student-assignments', component: StudentAssignments
      },

      {
        path: 'student-assignment', canActivate: [authGuard, assignmentGuard],  component: StudentAssignment
      },
      {
        path:'college-management',component:College, data: { permission: 'UPDATE_COLLEGE' }
      },
      {
        path:'department-management',component:Department, data: { permission: 'VIEW_DEPARTMENT' }
      },
      {
        path:'branch-management',component:Branch, data: { permission: 'UPDATE_BRANCH' }
      },
      {
        path:'domain',component:DomainComponent, data: { permission: 'VIEW_DOMAIN' }
      },
      {
        path:'course',component:Course, data: { permission: 'VIEW_COURSE' }
      },
      {
        path:'assignment',component:AssignmentComponent, data: { permission: 'UPDATE_ASSIGNMENT' }
      },
      {
        path:'task-management',component:Task, data: { permission: 'VIEW_TASK' }
      },
      {
        path:'year',component:Year, data: { permission: 'VIEW_YEAR' }
      },
      {
        path:'year-updation',component:YearUpdation, data: { permission: 'UPDATE_YEAR' }
      },
      {
        path:'user',component:UserComponent, data: { permission: 'VIEW_COURSE' }
      },
      {
        path:'role',component:Role, data: { permission: 'VIEW_ROLE' }
      },
      {
        path:'permission',component:Permission, data: { permission: 'VIEW_PERMISSION' }
      },
      {
        path:'profile',component:StudentProfile
      },
      {
       path:'leadership',component:Leadership, data: { permission: 'VIEW_STUDENT_DOMAIN' }
      },
      {
        path:'certificate',component:Certificate, data: { permission: 'VIEW_STUDENT_DOMAIN' }
      },
      {
        path:'ticket',component:TicketComponent, data: { permission: 'CREATE_TICKET' }
      },
      {
      path:'mytickets',component:MyTicketComponent
      },
      {
        path:'replyticket/:id',component:ReplyTicketComponent
      },
      {
        path:'alltickets',component:AllTicketsComponent, data: { permission: 'VIEW_ALL_TICKETS' }
      },
      {
        path: 'support-ticket-details/:id',component: SupportTicketDetailsComponent
      },
      {
        path:'college-department-mapping',component:CollegeDepartmentComponent, data: { permission: 'VIEW_COLLEGE_DEPARTMENT' }
      },
      {
        path:'department-branch-mapping',component:DepartmentBranchComponent, data: { permission: 'VIEW_DEPARTMENT_BRANCH' }
      },
      {
        path:'domain-course-mapping',component:DomainCourseMapComponent, data: { permission: 'VIEW_DOMAIN_COURSE_MAP' }
      },
      {
        path:'course-assignment-mapping',component:CourseAssignmentMapComponent, data: { permission: 'VIEW_COURSE_ASSIGNMENT_MAP' }
      },
      {
        path:'student-domain-course-mapping',component:StudentDomainMapComponent, data: { permission: 'VIEW_STUDENT_DOMAIN_COURSE_MAP' }
      },
      {
        path:'role-permission-mapping',component:RolePermissionComponent, data: { permission: 'VIEW_ROLE_PERMISSION' }
      },
      {
        path:'student-assignment-scores',component:StudentAssignmentscore, data: { permission: 'UPDATE_STUDENT_ASSIGNMENT' }
      },
      {
        path:'superamin-colleges', component:SuperAdmin, data: { permission: 'VIEW_SUPERADMIN_COLLEGES' }
      },
      {
        path:'superadmin-domains', component:SuperadminDomains
      },
      {
        path:'superadmin-domain-students', component:SuperadminDomainStudents
      },
      {
        path:'superadmin-student-assignments',component:SuperadminStudentAssignments
      },
      {
        path:'superadmin-student-assignment-code',component:SuperadminStudentAssignmentCode
      },
      {
        path:'view-certificate',component:Viewcertificate
      },
      {
        path:'change_password',component:ChangePassword
      }
    ]
  },

  {
    path: 'changepassword', component: Changepassword
  },

  {
    path: 'profile', component: ProfilePage
  },
  {
    path: 'page-not-found', component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];
 