import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { finalize } from 'rxjs';

import { Auth } from '../../../core/auth/auth';
import { DepartmentService } from '../../../features/services/department/department-service';
import { BranchService } from '../../../features/services/branch/branch-service';
import { DeptbranchService} from '../../../features/services/departmentbranch/deptbranch-service';

@Component({
  selector: 'app-departmentbranch',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './departmentbranch.html',
  styleUrls: ['./departmentbranch.css']
})
export class DepartmentBranchComponent implements OnInit {

  departmentBranchForm!: FormGroup;

  mappings: any[] = [];
  filteredMappings: any[] = [];

  departments: any[] = [];
  branches: any[] = [];

  submitted = false;
  loading = false;
  editMode = false;
  showModal = false;

  selectedId: number | null = null;

  searchText = '';

  constructor(
    private fb: FormBuilder,
    public auth: Auth,
    private departmentBranchService: DeptbranchService,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.buildForm();

    this.loadDepartments();
    this.loadBranches();
    this.loadMappings();

  }

  buildForm(): void {

    this.departmentBranchForm = this.fb.group({

      departmentName: ['', Validators.required],

      branchName: ['', Validators.required]

    });

  }

  //==========================
  // MODAL
  //==========================

  openAddModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  //==========================
  // LOAD DEPARTMENTS
  //==========================

  loadDepartments(): void {

    this.departmentService.getDepartments().subscribe({

      next: (res: any) => {

        this.departments = res.data || [];

        this.cd.detectChanges();

      },

      error: () => {

        this.departments = [];

      }

    });

  }

  //==========================
  // LOAD BRANCHES
  //==========================

  loadBranches(): void {

    this.branchService.getBranches().subscribe({

      next: (res: any) => {

        this.branches = res.data || [];

        this.cd.detectChanges();

      },

      error: () => {

        this.branches = [];

      }

    });

  }

  //==========================
  // LOAD MAPPINGS
  //==========================

  loadMappings(): void {

    this.loading = true;

    this.departmentBranchService
      .getDeptbranches()
      .pipe(finalize(() => this.loading = false))
      .subscribe({

        next: (res: any) => {

          this.mappings = res.data || [];

          this.filteredMappings = [...this.mappings];

          this.cd.detectChanges();

        },

        error: () => {

          this.mappings = [];
          this.filteredMappings = [];

        }

      });

  }

  //==========================
  // SAVE
  //==========================

  save(): void {

    this.submitted = true;

    if (this.departmentBranchForm.invalid) {

      this.departmentBranchForm.markAllAsTouched();

      return;

    }

    const payload = this.departmentBranchForm.value;

    this.loading = true;

    if (this.editMode) {

      if (this.selectedId == null) return;

      this.departmentBranchService
        .updateDeptbranch(this.selectedId, payload)
        .pipe(finalize(() => this.loading = false))
        .subscribe({

          next: () => {

            this.loadMappings();

            this.closeModal();

          }

        });

    } else {

      this.departmentBranchService
        .createDeptbranch(payload)
        .pipe(finalize(() => this.loading = false))
        .subscribe({

          next: () => {

            this.loadMappings();

            this.closeModal();

          }

        });

    }

  }

  //==========================
  // EDIT
  //==========================

  edit(item: any): void {

    if (!this.auth.hasPermission('UPDATE_DEPARTMENT_BRANCH')) return;

    this.editMode = true;

    this.selectedId = item.id;

    this.departmentBranchForm.patchValue({

      departmentName: item.departmentName,

      branchName: item.branchName

    });

    this.showModal = true;

  }

  //==========================
  // DELETE
  //==========================

  delete(id: number): void {

    if (!this.auth.hasPermission('DELETE_DEPARTMENT_BRANCH')) return;

    if (!confirm('Delete this mapping?')) return;

    this.departmentBranchService.deleteDeptbranch(id)
      .subscribe({

        next: () => {

          this.loadMappings();

        }

      });

  }

  //==========================
  // RESET
  //==========================

  resetForm(): void {

    this.submitted = false;

    this.editMode = false;

    this.selectedId = null;

    this.departmentBranchForm.reset();

  }

  //==========================
  // SEARCH
  //==========================

  search(): void {

    const value = this.searchText.toLowerCase();

    this.filteredMappings = this.mappings.filter(x =>

      x.departmentName.toLowerCase().includes(value) ||

      x.branchName.toLowerCase().includes(value)

    );

  }

}