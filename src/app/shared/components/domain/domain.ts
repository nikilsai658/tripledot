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
import { DomainServices } from '../../../features/services/domain/domain-services';

@Component({
  selector: 'app-domain',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './domain.html',
  styleUrls: ['./domain.css']
})
export class DomainComponent implements OnInit {

  domains: any[] = [];

  domainForm!: FormGroup;

  isEditMode = false;

  selectedId = 0;

  loading = false;

  showModal = false;

  constructor(
    private fb: FormBuilder,
    private api:DomainServices,
    private cookie: CookieService,
    private router: Router,
    public auth: Auth,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.domainForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      eligibleFromYear: [1, Validators.required],
      eligibleToYear: [1, Validators.required],
      isActive: [true]
    });

    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.cookie.get('token');

    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDomains();
  }

  //=============================
  // GET ALL
  //=============================

  loadDomains(): void {

    this.loading = true;

    this.api.getDomains().subscribe({

      next: (res: any) => {

        this.loading = false;

        this.domains =
          res.data ??
          res.result ??
          res.items ??
          res;

        if (!Array.isArray(this.domains)) {
          this.domains = [];
        }

        this.cd.detectChanges();
      },

      error: (err) => {

        this.loading = false;

        console.error(err);

      }

    });

  }

  //=============================
  // MODAL CONTROLS
  //=============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_DOMAIN')) {
      alert('Permission denied');
      return;
    }

    this.resetForm();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //=============================
  // CREATE
  //=============================

  createDomain(): void {

    if (!this.auth.hasPermission('CREATE_DOMAIN')) {
      alert('Permission denied');
      return;
    }

    if (this.domainForm.invalid) {
      this.domainForm.markAllAsTouched();
      return;
    }

    this.api.createDomain(this.domainForm.value).subscribe({

      next: () => {

        alert('Domain Created Successfully');

        this.resetForm();

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // EDIT
  //=============================

  editDomain(domain: any): void {

    if (!this.auth.hasPermission('UPDATE_DOMAIN')) {
      alert('Permission denied');
      return;
    }

    this.isEditMode = true;

    this.selectedId = domain.id;

    this.domainForm.patchValue({

      name: domain.name,
      description: domain.description,
      eligibleFromYear: domain.eligibleFromYear,
      eligibleToYear: domain.eligibleToYear,
      isActive: domain.isActive

    });

    this.showModal = true;

  }

  //=============================
  // UPDATE
  //=============================

  updateDomain(): void {

    if (!this.auth.hasPermission('UPDATE_DOMAIN')) {
      alert('Permission denied');
      return;
    }

    if (this.domainForm.invalid) {
      this.domainForm.markAllAsTouched();
      return;
    }

    this.api.updateDomain(
      this.selectedId,
      this.domainForm.value
    ).subscribe({

      next: () => {

        alert('Domain Updated Successfully');

        this.resetForm();

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // DELETE
  //=============================

  deleteDomain(id: number): void {

    if (!this.auth.hasPermission('DELETE_DOMAIN')) {
      alert('Permission denied');
      return;
    }

    if (!confirm('Delete this Domain?')) return;

    this.api.deleteDomain(id).subscribe({

      next: () => {

        alert('Deleted Successfully');

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // RESET
  //=============================

  resetForm(): void {

    this.isEditMode = false;

    this.selectedId = 0;

    this.showModal = false;

    this.domainForm.reset({

      name: '',
      description: '',
      eligibleFromYear: 1,
      eligibleToYear: 1,
      isActive: true

    });

  }

}