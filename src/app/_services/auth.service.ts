import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/retry'; // TODO: add retry to requests

export interface RegisterData {
  familyName: string;
  givenName: string;
  email: string;
  password: string;
  tos: boolean;
}

export interface LoginResponse {
  token: string;
}

@Injectable()
export class AuthService {

  private url: string = "/api/v1";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  public register(data: RegisterData) {
    return this.http
      .post(this.url + "/register", {
        familyName: data.familyName,
        givenName: data.givenName,
        email: data.email,
        password: data.password,
        tos: data.tos
      })
      .catch((err: HttpErrorResponse) => {
        console.error(err);

        return Observable.throw(err);
      });
  }

  public activate(id: string, code: string) {
    return this.http.post(this.url + "/activate-account", {
      id: id,
      code: code
    });
  }

  public login(email: string, password: string) {
    return this.http
      .post(this.url + "/login", {
        email: email,
        password: password
      })
      .do((response: LoginResponse) => {
        this.setAuthToken(response.token);
      })
      .catch((err: HttpErrorResponse) => {
        console.error(err);

        return Observable.throw(err);
      });
  }

  private setAuthToken(token): void {
    this.cookieService.set("authToken", token, 7);
  }

  public getAuthToken(): string | null {
    return this.cookieService.get("authToken");
  }

  public deleteAuthToken(): void {
    this.cookieService.delete("authToken");
  }

  public checkAuthToken(): boolean {
    // TODO: also check if token has expired
    return this.cookieService.check("authToken");
  }

}
