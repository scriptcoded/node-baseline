import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  private returnUrl: string;

  public form: FormGroup;

  public loading: boolean = false;
  public errors: string[] = [];

  @Output() loadingState = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string[]|null>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  public get email() {
    return this.form.get("email");
  }

  public get password() {
    return this.form.get("password");
  }

  public onSubmit() {
    this.updateLoadingState(true);

    this.errors = [];
    this.updateErrorMessage(null);

    let email = this.email.value;
    let password = this.password.value;

    this.authService
      .login(email, password)
      .subscribe(
        data => {
          this.router.navigateByUrl(this.returnUrl);
        },
        (response: HttpErrorResponse) => {
          let error = response.error;

          switch (response.status) {
            case 404:
              switch (error.name) {
                case "NotFoundError":
                  this.errors.push("Felaktiga inloggningsuppgifter");
                  break;
                default:
                  this.errors.push("Ett okänt fel har inträffat");
                  break;
              }
              break;
            default:
              this.errors.push("Ett okänt fel har inträffat");
              break;
          }

          this.updateErrorMessage(this.errors);
          this.updateLoadingState(false)
        },
        () => this.updateLoadingState(false)
      );
  }

  private updateLoadingState(state: boolean) {
    this.loading = state;
    this.loadingState.emit(state);
  }

  private updateErrorMessage(message: string[] | null): void {
    this.errorMessage.emit(message);
  }

}
