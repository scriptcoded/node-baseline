import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_models/user';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get authToken(): string | null {
    return this.authService.getAuthToken();
  }

  get user(): User | null {
    try {
      return jwt_decode(this.authToken);
    } catch(Error) {
      return null;
    }
  }

  public isLoggedIn() {
    return this.authService.checkAuthToken();
  }

  public logout(): void {
    this.authService.deleteAuthToken();

    this.router.navigate(["/login"]);
  }

}
