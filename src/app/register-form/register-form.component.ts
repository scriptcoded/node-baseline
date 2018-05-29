import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../custom.validators';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  public hidePassword: boolean = true;

  public form: FormGroup;

  public loading: boolean = false;
  public errors: string[] = [];

  @Output() loadingState = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string[]|null>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      givenName: ["", Validators.required],
      familyName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [
          Validators.required,
          Validators.minLength(8),
          CustomValidators.regex(new RegExp(".*[A-Z].*"), {"mustContainUppercase": true}),
          CustomValidators.regex(new RegExp(".*[a-z].*"), {"mustContainLowercase": true}),
          CustomValidators.regex(new RegExp(".*[^a-zA-Z\s].*"), {"mustContainNonAlphabetical": true})
        ]
      ],
      tos: [false, Validators.requiredTrue]
    });
  }

  public get givenName() {
    return this.form.get("givenName");
  }

  public get familyName() {
    return this.form.get("familyName");
  }

  public get email() {
    return this.form.get("email");
  }

  public get password() {
    return this.form.get("password");
  }

  public get tos() {
    return this.form.get("tos");
  }

  public onSubmit() {
    this.updateLoadingState(true);

    this.errors = [];
    this.updateErrorMessage(null);

    this.authService
      .register({
        familyName: this.familyName.value,
        givenName: this.givenName.value,
        email: this.email.value,
        password: this.password.value,
        tos: this.tos.value
      })
      .subscribe(
        data => {
          this.router.navigate(["/activate", "YOUR_ACTIVATION_ID"]); // TODO
        },
        (response: HttpErrorResponse) => {
          this.handleError(response);

          this.updateErrorMessage(this.errors);
          this.updateLoadingState(false)
        },
        () => this.updateLoadingState(false)
      );
  }

  private handleError(response: HttpErrorResponse) {
    let error = response.error;

    switch (response.status) {
      case 400:
        switch (error.name) {
          case "ValidationError":
            if (error.errors.hasOwnProperty("givenName")) {
              switch (error.errors.givenName.msg.code) {
                case "required":
                  this.givenName.setErrors({"required": true});
                  break;
                default:
                  this.givenName.setErrors({"unknown": true});
                  break;
              }
            }

            if (error.errors.hasOwnProperty("familyName")) {
              switch (error.errors.familyName.msg.code) {
                case "required":
                  this.familyName.setErrors({"required": true});
                  break;
                default:
                  this.familyName.setErrors({"unknown": true});
                  break;
              }
            }

            if (error.errors.hasOwnProperty("email")) {
              switch (error.errors.email.msg.code) {
                case "required":
                  this.email.setErrors({"required": true});
                  break;
                case "mustBeEmail":
                  this.email.setErrors({"email": true});
                  break;
                case "unavailable":
                  this.email.setErrors({"unavailable": true});
                  break;
                default:
                  this.email.setErrors({"unknown": true});
                  break;
              }
            }

            if (error.errors.hasOwnProperty("password")) {
              switch (error.errors.password.msg.code) {
                case "required":
                  this.password.setErrors({"required": true});
                  break;
                case "tooShort":
                  this.password.setErrors({"minlength": true});
                  break;
                case "includeNonAlpha":
                  this.password.setErrors({"mustContainNonAlphabetical": true});
                  break;
                case "includeUppercase":
                  this.password.setErrors({"mustContainUppercase": true});
                  break;
                case "includeLowercase":
                  this.password.setErrors({"mustContainLowercase": true});
                  break;
                default:
                  this.password.setErrors({"unknown": true});
                  break;
              }
            }
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
  }

  private updateLoadingState(state: boolean): void {
    this.loading = state;
    this.loadingState.emit(state);
  }

  private updateErrorMessage(message: string[] | null): void {
    this.errorMessage.emit(message);
  }

}
