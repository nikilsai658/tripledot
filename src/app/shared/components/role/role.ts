import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Auth } from '../../../core/auth/auth';
import { RoleService } from '../../../features/services/role/role-service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './role.html',
  styleUrls: ['./role.css']
})
export class Role implements OnInit {

  roles: any[] = [];

  roleForm: FormGroup;

  isEditMode = false;

  selectedRoleId = 0;

  showModal = false;

  constructor(
    private api: RoleService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    // Initialize form here
   this.roleForm = this.fb.group({
  name: ['', Validators.required],
  requiresCollege: [true],
  requiresDepartment: [true],
  requiresBranch: [true],
  requiresYear: [true]
});

  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.auth.hasPermission('VIEW_ROLE')) {
      alert('You do not have permission to view Roles.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadRoles();
  }

  //==============================
  // Load Roles
  //==============================

  loadRoles(): void {

    this.api.getRoles().subscribe({

      next: (res: any) => {

        if (Array.isArray(res)) {
          this.roles = res;
        } else if (Array.isArray(res.data)) {
          this.roles = res.data;
        } else if (Array.isArray(res.result)) {
          this.roles = res.result;
        } else {
          this.roles = [];
        }
        
        this.cd.detectChanges();

      },

      error: (err) => {
        console.error(err);
        this.roles = [];
      }

    });

  }

  //==============================
  // Modal Controls
  //==============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_ROLE')) {
      alert('You do not have permission to create Role.');
      return;
    }

    this.resetForm();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //==============================
  // Create Role
  //==============================

  createRole(): void {

    if (!this.auth.hasPermission('CREATE_ROLE')) {
      alert('You do not have permission to create Role.');
      return;
    }

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.api.createRole(this.roleForm.value).subscribe({

      next: () => {

        alert('Role Created Successfully');

        this.resetForm();

        this.loadRoles();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  //==============================
  // Edit Role
  //==============================

  editRole(role: any): void {

    if (!this.auth.hasPermission('UPDATE_ROLE')) {
      alert('You do not have permission to edit Role.');
      return;
    }

    this.isEditMode = true;

    this.selectedRoleId = role.id;

    this.roleForm.patchValue({

      roleName: role.roleName,
      requiresCollege: role.requiresCollege,
      requiresDepartment: role.requiresDepartment,
      requiresBranch: role.requiresBranch,
      requiresYear: role.requiresYear

    });

    this.showModal = true;

  }

  //==============================
  // Update Role
  //==============================

  updateRole(): void {

    if (!this.auth.hasPermission('UPDATE_ROLE')) {
      alert('You do not have permission to update Role.');
      return;
    }

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.api.updateRole(
      this.selectedRoleId,
      this.roleForm.value
    ).subscribe({

      next: () => {

        alert('Role Updated Successfully');

        this.resetForm();

        this.loadRoles();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  //==============================
  // Delete Role
  //==============================

  deleteRole(id: number): void {

    if (!this.auth.hasPermission('DELETE_ROLE')) {
      alert('You do not have permission to delete Role.');
      return;
    }

    if (!confirm('Are you sure you want to delete this Role?')) {
      return;
    }

    this.api.deleteRole(id).subscribe({

      next: () => {

        alert('Role Deleted Successfully');

        this.loadRoles();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  //==============================
  // Reset Form
  //==============================

  resetForm(): void {

    this.roleForm.reset({

      roleName: '',
      requiresCollege: true,
      requiresDepartment: true,
      requiresBranch: true,
      requiresYear: true

    });

    this.isEditMode = false;
    this.selectedRoleId = 0;
    this.showModal = false;

  }

}