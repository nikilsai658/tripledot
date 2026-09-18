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
import { BranchService } from '../../../features/services/branch/branch-service';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './branch.html',
  styleUrls: ['./branch.css']
})
export class Branch implements OnInit {

  branches: any[] = [];

  departments: any[] = [];

  branchForm!: FormGroup;

  isEditMode = false;

  selectedBranchId = 0;

  showModal = false;

  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.branchForm = this.fb.group({

      name: ['', Validators.required],

      code: ['', Validators.required],

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    if (this.auth.hasPermission('VIEW_BRANCH')) {

      this.loadBranches();

    }

  }

  //=====================================
  // Load Branches
  //=====================================

  loadBranches(): void {

    this.api.getBranches().subscribe({

      next: (res: any) => {

        console.log('Branch Response', res);

        if (Array.isArray(res)) {

          this.branches = res;

        }

        else if (Array.isArray(res.data)) {

          this.branches = res.data;

        }

        else if (Array.isArray(res.result)) {

          this.branches = res.result;

        }

        else {

          this.branches = [];

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.branches = [];

      }

    });

  }

  //=====================================
  // Modal Controls
  //=====================================

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedBranchId = 0;

    this.branchForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //=====================================
  // Create Branch
  //=====================================

  createBranch(): void {

    if (this.branchForm.invalid) {

      this.branchForm.markAllAsTouched();

      return;

    }

    this.api.createBranch(this.branchForm.value).subscribe({

      next: () => {

        alert('Branch Created Successfully');

        this.branchForm.reset();

        this.showModal = false;

        this.loadBranches();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Edit Branch
  //=====================================

  editBranch(branch: any): void {

    this.isEditMode = true;

    this.selectedBranchId = branch.id;

    this.branchForm.patchValue({

      name: branch.name,

      code: branch.code,

      departmentId: branch.departmentId

    });

    this.showModal = true;

  }

  //=====================================
  // Update Branch
  //=====================================

  updateBranch(): void {

    if (this.branchForm.invalid) {

      this.branchForm.markAllAsTouched();

      return;

    }

    this.api.updateBranch(

      this.selectedBranchId,

      this.branchForm.value

    ).subscribe({

      next: () => {

        alert('Branch Updated Successfully');

        this.branchForm.reset();

        this.isEditMode = false;

        this.selectedBranchId = 0;

        this.showModal = false;

        this.loadBranches();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Delete Branch
  //=====================================

  deleteBranch(id: number): void {

    if (!confirm('Are you sure you want to delete this branch?')) {

      return;

    }

    this.api.deleteBranch(id).subscribe({

      next: () => {

        alert('Branch Deleted Successfully');

        this.loadBranches();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Reset Form
  //=====================================

  resetForm(): void {

    this.branchForm.reset();

    this.isEditMode = false;

    this.selectedBranchId = 0;

    this.showModal = false;

  }

}