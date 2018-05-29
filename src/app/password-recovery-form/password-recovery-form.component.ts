import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery-form',
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.css']
})
export class PasswordRecoveryFormComponent implements OnInit {

  form: FormGroup;

  loading: boolean = false;
  errors: string[] = [];

  @Output() loadingState = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string[]|null>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.form.get("email");
  }

  onSubmit() {
    /* this.updateLoadingState(true);
    this.errors = [];
    this.updateErrorMessage(null); */

    this.router.navigate(["/password-recovery", { id: "jnsadkjsadj"}]);
  }

  updateLoadingState(state: boolean) {
    this.loading = state;
    this.loadingState.emit(state);
  }

  updateErrorMessage(message: string[] | null): void {
    this.errorMessage.emit(message);
  }

}
