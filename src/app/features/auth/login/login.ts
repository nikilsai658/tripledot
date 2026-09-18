import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {FormBuilder,Validators} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServices } from '../../services/auth/auth-services'
import { UserStore } from '../../../core/store/user';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [Logo, FloatLabelModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login implements OnInit{
  Form !:FormGroup;
  collegecode:any;
  errorMessage = '';
  loading = false;
   constructor(private fb: FormBuilder, private router:Router,private cookie:CookieService,private auth:AuthServices,private userStore:UserStore,private cd: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object){
    this.Form=this.fb.group({
      userNameOrEmail: ['',Validators.required],
      password: ['',Validators.required],
      collegeCode: ['', Validators.required]
    });
    
   }
    ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.collegecode = localStorage.getItem('collegecode');

      if (this.collegecode) {
        this.Form.patchValue({ collegeCode: this.collegecode });
      }
    }
  }
     
   onSubmit(){
    this.errorMessage = '';

    if(this.Form.valid){
      this.loading = true;
      this.cd.markForCheck();

      this.auth.login(this.Form.value).subscribe({
        next:(res :any)=>{
          this.loading = false;

          const token=res.data.accessToken;
          const refresh=res.data.refreshToken;
         localStorage.setItem('user', JSON.stringify(res.data));
          this.userStore.setUser(res.data);
          this.cookie.set('token', token, 7, '/');
          this.cookie.set('refresh', refresh, 7, '/');
         if(res.data.isFirstLogin=== true ){
          this.router.navigate(['/changepassword']);
         }else if(res.data.isFirstLogin=== false && res.data.profileCompleted=== false){
           this.router.navigate(['/profile']);
         }else{
         this.router.navigate(['/main']);
         }
        },error:(err)=>{
          console.log(err);

          this.loading = false;

          this.errorMessage = this.extractErrorMessage(err);

          this.cd.markForCheck();
        }
      })
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
      'Invalid username or password. Please try again.'
    );

   }
}