import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError ,catchError} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient,private cookie:CookieService,private router:Router, @Inject(PLATFORM_ID) private platformId: Object){

  }
  private getHeaders(): HttpHeaders {

  if (!isPlatformBrowser(this.platformId)) {
    return new HttpHeaders();
  }

  const token = this.cookie.get('token');

  if (!token) {
    // No token yet (e.g. the pre-login college-select page) — send the
    // request without an Authorization header instead of redirecting;
    // a 401 from the backend is still handled by handleError().
    return new HttpHeaders();
  }

  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}

private showAlert(message: string): void {
  if (isPlatformBrowser(this.platformId)) {
    alert(message);
  }
}

private handleError(err: any, silent = false) {

  // Silent mode: the caller renders its own inline error UI, so skip
  // the blocking alert(s) — still clear stale auth on a 401 though.
  if (silent) {
    if (err.status === 401) {
      this.cookie.delete('token', '/');
      this.cookie.delete('refresh', '/');
    }
    return throwError(() => err);
  }

  if (err.status === 400) {
    this.showAlert(err.error.message);
  } else if (err.status === 401) {
    this.cookie.delete('token', '/');
    this.cookie.delete('refresh', '/');
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/auth/login']);
    }
  } else if (err.status === 403) {
    this.showAlert('Forbidden');
  } else if (err.status === 404) {
    // A 404 on a "get my records" style endpoint usually just means
    // "nothing found yet" — let the calling component's own error
    // handler decide how to render that instead of interrupting the
    // user with a blocking alert.
  } else if (err.status === 500) {
    this.showAlert('Internal Server Error');
  } else {
    this.showAlert('Something went wrong');
  }

  return throwError(() => err);
}

 POST(url: string, payload: any, options?: { silent?: boolean }) {

  return this.http.post(
    `http://localhost:5000/api/${url}`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(

    catchError((err) => this.handleError(err, options?.silent))

  );

}
GET(url: string, params?: any) {
  return this.http.get(`http://localhost:5000/api/${url}`, {
    headers: this.getHeaders(),
    params: params
  }).pipe(
    catchError((err) => this.handleError(err))
  );
}
  GETBlob(url: string) {
    return this.http.get(`http://localhost:5000/api/${url}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  PUT(url: string, payload: any) {
    return this.http.put(`http://localhost:5000/api/${url}`,payload,{  headers: this.getHeaders()  }).pipe(
      catchError((err) => this.handleError(err))
    )
  }

  DELETE(url: string) {
    return this.http.delete(`http://localhost:5000/api/${url}`,{  headers: this.getHeaders()  }).pipe(
      catchError((err) => this.handleError(err))
    )

  }
}
