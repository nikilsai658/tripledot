import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  constructor(private api:Api) {}
   login(data:any){
   return this.api.POST('Auth/login',data,{silent:true});
  }
  refreshToken(refreshToken:string){
   return this.api.POST('Auth/refresh-token',{refreshToken});
  }
  forgotpassword(data:any) {
    return this.api.POST('Auth/forget-password',data);
  }
  resetpassword(data:any){
    return this.api.POST('Auth/reset-password',data);
  }
  changepassword(data:any ){
  return this.api.POST('Auth/change-password',data);
  } 
  profileupdate(data:any){
    return this.api.POST('Auth/complete-profile',data);
  }
  logout(data:any){
    return this.api.POST('Auth/logout',data);
  }
  logoutAll(data:any){
    return this.api.POST('Auth/logout-all',data);
  }
}
