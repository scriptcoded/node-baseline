import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Material */
import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatDividerModule,
  MatTableModule,
  MatStepperModule,
  MatExpansionModule,
  MatCheckboxModule
} from '@angular/material';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

/* Services */
import { MyHttpInterceptor } from "./_services/http-interceptor";
import { AuthService } from './_services/auth.service';
import { AuthGuard } from './_services/auth-guard.service';
import { UserService } from './_services/user.service';
import { UsersService } from './_services/users.service';
import { CookieService } from 'ngx-cookie-service';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthCardComponent } from './auth-card/auth-card.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UsersComponent } from './users/users.component';
import { PanelComponent } from './panel/panel.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { RegisterComponent } from './register/register.component';
import { ListItemExpandComponent } from './list-item-expand/list-item-expand.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { CreateScheduleComponent } from './create-schedule/create-schedule.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrgCardComponent } from './org-card/org-card.component';
import { ChooseOrgComponent } from './choose-org/choose-org.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { ActivateAccountFormComponent } from './activate-account-form/activate-account-form.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { PasswordRecoveryFormComponent } from './password-recovery-form/password-recovery-form.component';


const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "app",
    component: PanelComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "users/create", component: CreateUserComponent },
      { path: "users", component: UsersComponent },
      { path: "schedule/create", component: CreateScheduleComponent },
      { path: "schedule", component: ScheduleComponent },
    ]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "activate/:id",
    component: ActivateAccountComponent
  },
  {
    path: "password-recovery",
    component: PasswordRecoveryComponent
  },
  {
    path: "org",
    component: ChooseOrgComponent
  },
  {
    path: "schedule/:id/edit",
    component: EditScheduleComponent
  },
  {
    path: "**",
    component: NotFoundComponent
  },
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthCardComponent,
    LoginFormComponent,
    HomeComponent,
    DashboardComponent,
    SidenavComponent,
    ToolbarComponent,
    UsersComponent,
    PanelComponent,
    ScheduleComponent,
    RegisterComponent,
    ListItemExpandComponent,
    CreateUserComponent,
    RegisterFormComponent,
    CreateScheduleComponent,
    EditScheduleComponent,
    NotFoundComponent,
    OrgCardComponent,
    ChooseOrgComponent,
    ActivateAccountComponent,
    ActivateAccountFormComponent,
    PasswordRecoveryComponent,
    PasswordRecoveryFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    /* Angular Material */
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatStepperModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    AuthService,
    CookieService,
    UserService,
    AuthGuard,
    BreakpointObserver,
    MediaMatcher,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
