import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate-account-form',
  templateUrl: './activate-account-form.component.html',
  styleUrls: ['./activate-account-form.component.css']
})
export class ActivateAccountFormComponent implements OnInit {

  id: string;

  activateAccountForm: FormGroup;

  loading: boolean = false;
  errors: string[] = [];

  @Output() loadingState = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string[]|null>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
    });

    this.activateAccountForm = this.fb.group({
      code: ["", Validators.required]
    });
  }

  get code() {
    return this.activateAccountForm.get("code");
  }

  activate() {
    this.updateLoadingState(true);
    this.errors = [];
    this.updateErrorMessage(null);

    let id = this.id;
    let code = this.code.value

    this.authService.activate(id, code)
      .subscribe(
        data => {
          // successfully activated account
        },
        (response: HttpErrorResponse) => {
          console.log(response);

          this.errors.push("Ett okänt fel har inträffat");

          this.updateErrorMessage(this.errors);
          this.updateLoadingState(false);
        }
      );
  }

  updateLoadingState(state: boolean): void {
    this.loading = state;
    this.loadingState.emit(state);
  }

  updateErrorMessage(message: string[] | null): void {
    this.errorMessage.emit(message);
  }

}
