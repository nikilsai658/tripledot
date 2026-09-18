import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
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
import { PermissionService } from '../../../features/services/permission/permission-service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.css']
})
export class Permission implements OnInit {

  permissions: any[] = [];

  permissionForm!: FormGroup;

  isEditMode = false;

  selectedPermissionId = 0;

  showModal = false;

  constructor(
    private api: PermissionService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.permissionForm = this.fb.group({

      name: ['', Validators.required],

      code: ['', Validators.required]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    if (this.auth.hasPermission('VIEW_PERMISSION')) {

      this.loadPermissions();

    }

  }

  //============================
  // Load
  //============================

  loadPermissions(): void {

    this.api.getPermissions().subscribe({

      next: (res: any) => {

        if (Array.isArray(res))
          this.permissions = res;

        else if (Array.isArray(res.data))
          this.permissions = res.data;

        else if (Array.isArray(res.result))
          this.permissions = res.result;

        else
          this.permissions = [];

        this.cd.detectChanges();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Modal Controls
  //============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_PERMISSION')) {
      alert('No Permission');
      return;
    }

    this.isEditMode = false;

    this.selectedPermissionId = 0;

    this.permissionForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //============================
  // Create
  //============================

  createPermission(): void {

    if (!this.auth.hasPermission('CREATE_PERMISSION')) {
      alert('No Permission');
      return;
    }

    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    this.api.createPermission(this.permissionForm.value).subscribe({

      next: () => {

        alert('Permission Created Successfully');

        this.resetForm();

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Edit
  //============================

  editPermission(permission: any): void {

    if (!this.auth.hasPermission('UPDATE_PERMISSION')) {
      alert('No Permission');
      return;
    }

    this.isEditMode = true;

    this.selectedPermissionId = permission.id;

    this.permissionForm.patchValue({

      name: permission.name,

      code: permission.code

    });

    this.showModal = true;

  }

  //============================
  // Update
  //============================

  updatePermission(): void {

    if (!this.auth.hasPermission('UPDATE_PERMISSION')) {
      alert('No Permission');
      return;
    }

    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    this.api.updatePermission(

      this.selectedPermissionId,

      this.permissionForm.value

    ).subscribe({

      next: () => {

        alert('Permission Updated Successfully');

        this.resetForm();

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Delete
  //============================

  deletePermission(id: number): void {

    if (!this.auth.hasPermission('DELETE_PERMISSION')) {
      alert('No Permission');
      return;
    }

    if (!confirm('Delete Permission?'))
      return;

    this.api.deletePermission(id).subscribe({

      next: () => {

        alert('Permission Deleted Successfully');

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Reset
  //============================

  resetForm(): void {

    this.permissionForm.reset({

      name: '',

      code: ''

    });

    this.isEditMode = false;

    this.selectedPermissionId = 0;

    this.showModal = false;

  }

}