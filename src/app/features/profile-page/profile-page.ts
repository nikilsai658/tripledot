import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthServices } from '../services/auth/auth-services';
import { Logo } from '../../shared/logo/logo';
@Component({
  selector: 'app-profile-page',
  imports: [CommonModule,ReactiveFormsModule,InputTextModule,FloatLabelModule,ButtonModule,Logo],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {
  Form !:FormGroup;
  errorMessage = '';
  loading = false;
  constructor(private fb:FormBuilder,private router:Router, private cookie:CookieService,private auth:AuthServices,private cd:ChangeDetectorRef){
    this.Form=this.fb.group({
      fullName: ['',Validators.required],
      firstName: ['',Validators.required],
      middleName: [''],
      lastName: ['',Validators.required],
      phoneNumber:['',Validators.required],
      alternatePhoneNumber: [''],
      alternateEmail:['',Validators.email]
    })
  }

  onSubmit(){
    this.errorMessage = '';

    if(this.Form.valid){
      this.loading = true;
      this.cd.markForCheck();

      this.auth.profileupdate(this.Form.value).subscribe({
        next:(res)=>{
          this.loading = false;
          alert('updated sucessfully');
          this.router.navigate(['/main']);
        },error:(err)=>{
          console.log(err);
          this.loading = false;
          this.errorMessage = this.extractErrorMessage(err);
          this.cd.markForCheck();
        }
      })
    }else{
      this.errorMessage = this.Form.get('alternateEmail')?.invalid && this.Form.get('alternateEmail')?.value
        ? 'Please enter a valid alternate email.'
        : 'Please fill in all the required fields.';
    }
  }

  private extractErrorMessage(err: any): string {
    const body = err?.error;

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    return (
      body?.message ||
      body?.title ||
      body?.error ||
      body?.errorMessage ||
      'Unable to update profile. Please try again.'
    );
  }
}
